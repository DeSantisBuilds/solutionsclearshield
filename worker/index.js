// Cloudflare Worker: serves the website files and receives quote requests.
//
// POST /api/quote  -> checks the form, stores photos (if the R2 bucket is connected),
//                     then sends everything to the GoHighLevel Inbound Webhook (secret GHL_WEBHOOK_URL).
// GET  /api/photo/... -> shows a stored photo, only with a valid signed link (secret PHOTO_LINK_SECRET).
//
// Everything else is the static site in ./dist.

const MAX_FIELD = 3000;
const MAX_PHOTO_BYTES = 12 * 1024 * 1024;
const PHOTO_LINK_DAYS = 90;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === '/api/quote') {
      if (request.method !== 'POST') return json({ ok: false, error: 'method' }, 405, { Allow: 'POST' });
      return handleQuote(request, env, url);
    }
    if (url.pathname.startsWith('/api/photo/') && request.method === 'GET') {
      return handlePhoto(url, env);
    }
    if (url.pathname.startsWith('/api/')) return json({ ok: false, error: 'not_found' }, 404);
    return env.ASSETS.fetch(request);
  },
};

async function handleQuote(request, env, url) {
  const wantsJson = (request.headers.get('Accept') || '').includes('application/json');
  const lang = url.searchParams.get('lang') === 'en' ? 'en' : null;
  let form;
  try {
    form = await request.formData();
  } catch {
    return reply(false, 'bad_form', 400);
  }
  const L = (form.get('lang') || lang) === 'en' ? 'en' : 'fr';
  const thanks = L === 'en' ? '/en/thank-you/' : '/merci/';
  const back = L === 'en' ? '/en/quote/' : '/soumission/';

  function reply(ok, error, status = 200) {
    if (wantsJson) return json(ok ? { ok: true } : { ok: false, error }, status);
    // Without JavaScript: send the visitor to the thank-you page, or back to the form.
    return Response.redirect(new URL(ok ? thanks : `${back}?erreur=${error}`, url).toString(), 303);
  }

  // Spam checks: hidden field filled in, or form sent impossibly fast. Pretend success so bots learn nothing.
  if (str(form.get('website'))) return reply(true);
  const started = Number(form.get('started') || 0);
  if (started && Date.now() - started < 3000) return reply(true);

  const name = str(form.get('name'), 120);
  const email = str(form.get('email'), 160);
  const phone = str(form.get('phone'), 40);
  const consent = str(form.get('consent'));
  if (!name || (!email && !phone)) return reply(false, 'missing_contact', 400);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return reply(false, 'bad_email', 400);
  if (!consent) return reply(false, 'no_consent', 400);

  if (!env.GHL_WEBHOOK_URL) {
    console.error('GHL_WEBHOOK_URL is not set: quote request could not be delivered.');
    return reply(false, 'not_configured', 503);
  }

  const id = crypto.randomUUID();
  const unit = str(form.get('unit')) === 'cm' ? 'cm' : 'po';
  const windows = collectWindows(form, unit);
  const films = form.getAll('films').map((f) => str(f, 30)).filter(Boolean);
  const type = str(form.get('type'), 20);
  const details = str(form.get('details'), MAX_FIELD);

  // Photos: stored in R2 when the bucket is connected; the CRM gets signed links.
  const photoFiles = form.getAll('photos').filter((f) => f && typeof f === 'object' && f.size > 0);
  const maxPhotos = Number(env.MAX_PHOTOS || 10);
  const photoLinks = [];
  let photosNotStored = 0;
  for (const [i, file] of photoFiles.slice(0, maxPhotos).entries()) {
    if (!env.PHOTOS || !env.PHOTO_LINK_SECRET || file.size > MAX_PHOTO_BYTES || !/^image\//.test(file.type || 'image/')) {
      photosNotStored++;
      continue;
    }
    const ext = (file.name.match(/\.(jpe?g|png|webp|heic|heif|gif)$/i)?.[1] || 'jpg').toLowerCase();
    const d = new Date();
    const key = `quotes/${d.getUTCFullYear()}/${String(d.getUTCMonth() + 1).padStart(2, '0')}/${id}/${i + 1}.${ext}`;
    await env.PHOTOS.put(key, file.stream(), { httpMetadata: { contentType: file.type || 'image/jpeg' } });
    photoLinks.push(await signedPhotoUrl(url.origin, key, env.PHOTO_LINK_SECRET));
  }

  const message = buildMessage({ L, type, films, details, windows, unit, photoLinks, photosNotStored, photoCount: photoFiles.length });

  // Same field names as the old GoHighLevel form (name, email, phone, message, service), plus new detail fields.
  const payload = {
    name,
    email,
    phone,
    message,
    service: films.join(', '),
    building_type: type,
    films,
    project_details: details,
    windows,
    window_unit: unit,
    window_count: windows.reduce((a, w) => a + (Number(w.quantity) || 0), 0),
    photo_urls: photoLinks,
    photo_count: photoFiles.length,
    city: str(form.get('city'), 60),
    address: str(form.get('address'), 200),
    contact_preference: str(form.get('contact_pref'), 20),
    marketing_consent: str(form.get('marketing')) ? 'oui' : 'non',
    contact_consent: 'oui',
    language: L,
    source_page: str(form.get('page'), 200),
    referrer: str(form.get('referrer'), 300),
    utm: str(form.get('utm'), 500),
    request_id: id,
    submitted_at: new Date().toISOString(),
    website: 'solutionsclearshield.com (nouveau site)',
  };

  try {
    const res = await fetch(env.GHL_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`GoHighLevel answered ${res.status}`);
  } catch (e) {
    console.error('Quote delivery failed', id, String(e));
    return reply(false, 'delivery_failed', 502);
  }
  return reply(true);
}

function collectWindows(form, unit) {
  const loc = form.getAll('win_loc'), w = form.getAll('win_w'), h = form.getAll('win_h'), q = form.getAll('win_q'), g = form.getAll('win_glass');
  const out = [];
  for (let i = 0; i < Math.min(loc.length, 50); i++) {
    const row = {
      location: str(loc[i], 120),
      width: str(w[i], 10),
      height: str(h[i], 10),
      quantity: str(q[i], 4) || '1',
      glass: str(g[i], 20) || 'inconnu',
      unit,
    };
    if (row.location || row.width || row.height) out.push(row);
  }
  return out;
}

function buildMessage({ L, type, films, details, windows, unit, photoLinks, photosNotStored, photoCount }) {
  const fr = L === 'fr';
  const lines = [];
  lines.push(`${fr ? 'Type' : 'Type'}: ${type || '-'}`);
  lines.push(`${fr ? 'Films' : 'Films'}: ${films.join(', ') || '-'}`);
  if (details) lines.push(`${fr ? 'Détails' : 'Details'}: ${details}`);
  if (windows.length) {
    lines.push(fr ? 'Fenêtres :' : 'Windows:');
    const u = unit === 'cm' ? 'cm' : fr ? 'po' : 'in';
    const glassNames = fr
      ? { inconnu: 'inconnu', simple: 'simple', double: 'double (thermos)', triple: 'triple' }
      : { inconnu: 'unknown', simple: 'single', double: 'double (thermos)', triple: 'triple' };
    for (const w of windows) {
      lines.push(`- ${w.location || '?'} : ${w.width || '?'} × ${w.height || '?'} ${u} × ${w.quantity} (${fr ? 'verre' : 'glass'}: ${glassNames[w.glass] || w.glass})`);
    }
  }
  if (photoCount) {
    lines.push(`${fr ? 'Photos' : 'Photos'}: ${photoCount}`);
    photoLinks.forEach((p) => lines.push(p));
    if (photosNotStored) lines.push(fr ? `(${photosNotStored} photo(s) non conservée(s) : stockage non configuré)` : `(${photosNotStored} photo(s) not stored: storage not set up)`);
  }
  return lines.join('\n');
}

async function handlePhoto(url, env) {
  if (!env.PHOTOS || !env.PHOTO_LINK_SECRET) return new Response('Not found', { status: 404 });
  const key = decodeURIComponent(url.pathname.slice('/api/photo/'.length));
  const exp = Number(url.searchParams.get('exp') || 0);
  const sig = url.searchParams.get('sig') || '';
  if (!key.startsWith('quotes/') || !exp || exp < Date.now() / 1000) return new Response('Link expired', { status: 403 });
  const expected = await hmac(env.PHOTO_LINK_SECRET, `${key}:${exp}`);
  if (!timingSafeEqual(sig, expected)) return new Response('Forbidden', { status: 403 });
  const obj = await env.PHOTOS.get(key);
  if (!obj) return new Response('Not found', { status: 404 });
  return new Response(obj.body, {
    headers: {
      'Content-Type': obj.httpMetadata?.contentType || 'image/jpeg',
      'Cache-Control': 'private, max-age=3600',
      'X-Robots-Tag': 'noindex',
    },
  });
}

async function signedPhotoUrl(origin, key, secret) {
  const exp = Math.floor(Date.now() / 1000) + PHOTO_LINK_DAYS * 86400;
  const sig = await hmac(secret, `${key}:${exp}`);
  return `${origin}/api/photo/${encodeURIComponent(key)}?exp=${exp}&sig=${sig}`;
}

async function hmac(secret, data) {
  const k = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const s = await crypto.subtle.sign('HMAC', k, new TextEncoder().encode(data));
  return [...new Uint8Array(s)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

function str(v, max = MAX_FIELD) {
  if (v == null || typeof v !== 'string') return '';
  return v.trim().slice(0, max);
}

function json(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers } });
}

// Quote form: one step at a time, window rows, photo previews, and sending to /api/quote.
// Without JavaScript the form still works: all steps show and it posts normally.

type Text = {
  needType: string; needName: string; needContact: string; badEmail: string; needConsent: string;
  tooMany: string; failed: string; next: string; send: string; sending: string;
  rows: string; panes: string; remove: string; thanks: string;
};

const MAX_PHOTOS = 10;
const MAX_SIDE = 1800;

const form = document.getElementById('quote') as HTMLFormElement | null;
if (form) init(form);

function init(form: HTMLFormElement) {
  const T: Text = JSON.parse(form.dataset.text || '{}');
  const steps = Array.from(form.querySelectorAll<HTMLFieldSetElement>('.qstep'));
  const titles = steps.map((s) => s.querySelector('legend')?.textContent || '');
  const title = document.getElementById('q-title')!;
  const prog = Array.from(document.querySelectorAll('#q-prog li'));
  const prev = document.getElementById('q-prev') as HTMLButtonElement;
  const spacer = document.getElementById('q-spacer')!;
  const next = document.getElementById('q-next') as HTMLButtonElement;
  const err = document.getElementById('q-err')!;
  const rowsBox = document.getElementById('q-rows')!;
  const addBtn = document.getElementById('q-add') as HTMLButtonElement;
  const sum = document.getElementById('q-sum')!;
  const photoInput = document.getElementById('q-photos') as HTMLInputElement;
  const drop = document.getElementById('q-drop')!;
  const thumbs = document.getElementById('q-thumbs')!;
  let step = 0;
  let photos: File[] = [];

  // Prefill from the link that brought the visitor here (?type=commercial, ?film=solaire).
  const params = new URLSearchParams(location.search);
  const type = params.get('type');
  if (type) form.querySelector<HTMLInputElement>(`input[name="type"][value="${CSS.escape(type)}"]`)?.click();
  const film = params.get('film');
  if (film) {
    const box = form.querySelector<HTMLInputElement>(`input[name="films"][value="${CSS.escape(film)}"]`);
    if (box) box.checked = true;
  }
  setHidden('page', location.pathname);
  setHidden('referrer', document.referrer.slice(0, 300));
  setHidden('started', String(Date.now()));
  try { setHidden('utm', sessionStorage.getItem('cs_utm') || ''); } catch { /* storage blocked */ }

  function setHidden(name: string, value: string) {
    const el = form.querySelector<HTMLInputElement>(`input[name="${name}"]`);
    if (el) el.value = value;
  }

  // ---- steps ----
  function show(i: number) {
    step = i;
    steps.forEach((s, j) => { s.hidden = j !== i; });
    title.textContent = titles[i];
    prog.forEach((li, j) => li.classList.toggle('on', j <= i));
    prev.hidden = i === 0;
    spacer.hidden = i !== 0;
    next.textContent = i === steps.length - 1 ? T.send : T.next;
    err.textContent = '';
  }
  prev.addEventListener('click', () => { show(Math.max(0, step - 1)); scrollTop(); });
  function scrollTop() {
    const top = form.getBoundingClientRect().top + window.scrollY - 90;
    if (window.scrollY > top) window.scrollTo({ top });
  }

  function validStep(i: number): string {
    if (i === 0 && !form.querySelector('input[name="type"]:checked')) return T.needType;
    if (i === 3) {
      const name = (form.elements.namedItem('name') as HTMLInputElement).value.trim();
      const phone = (form.elements.namedItem('phone') as HTMLInputElement).value.trim();
      const emailEl = form.elements.namedItem('email') as HTMLInputElement;
      const email = emailEl.value.trim();
      if (!name) return T.needName;
      if (!phone && !email) return T.needContact;
      if (email && !emailEl.checkValidity()) return T.badEmail;
      if (!(form.elements.namedItem('consent') as HTMLInputElement).checked) return T.needConsent;
    }
    return '';
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const problem = validStep(step);
    if (problem) { err.textContent = problem; return; }
    if (step < steps.length - 1) { show(step + 1); scrollTop(); return; }
    // Final check of step 1 in case the visitor came back and changed it.
    const first = validStep(0);
    if (first) { show(0); err.textContent = first; return; }
    await send();
  });

  async function send() {
    next.disabled = true;
    prev.disabled = true;
    next.textContent = T.sending;
    err.textContent = '';
    try {
      const data = new FormData(form);
      data.delete('photos');
      for (const f of photos) {
        const small = await shrink(f);
        data.append('photos', small, small.name);
      }
      const res = await fetch(form.action, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
      const out = await res.json().catch(() => ({}));
      if (!res.ok || !out.ok) throw new Error(out.error || String(res.status));
      try { (window as any).dataLayer?.push({ event: 'quote_submitted' }); } catch { /* ignore */ }
      location.href = T.thanks;
    } catch {
      err.textContent = T.failed;
      next.disabled = false;
      prev.disabled = false;
      next.textContent = T.send;
    }
  }

  // ---- window rows ----
  const template = rowsBox.querySelector('.wrow')!.cloneNode(true) as HTMLElement;
  template.querySelectorAll('input').forEach((i) => { i.value = i.name === 'win_q' ? '1' : ''; });
  function wireRow(row: HTMLElement) {
    const rm = row.querySelector<HTMLButtonElement>('.rm')!;
    rm.hidden = false;
    rm.addEventListener('click', () => { row.remove(); summary(); });
    row.querySelectorAll('input').forEach((i) => i.addEventListener('input', summary));
  }
  rowsBox.querySelectorAll<HTMLElement>('.wrow').forEach(wireRow);
  addBtn.hidden = false;
  addBtn.addEventListener('click', () => {
    const row = template.cloneNode(true) as HTMLElement;
    rowsBox.appendChild(row);
    wireRow(row);
    row.querySelector('input')?.focus();
    summary();
  });
  function summary() {
    const rows = Array.from(rowsBox.querySelectorAll('.wrow'));
    const filled = rows.filter((r) => Array.from(r.querySelectorAll('input')).some((i) => i.name !== 'win_q' && i.value.trim()));
    const panes = filled.reduce((a, r) => a + (parseInt((r.querySelector('input[name="win_q"]') as HTMLInputElement).value, 10) || 0), 0);
    sum.textContent = filled.length ? `${filled.length} ${T.rows} · ${panes} ${T.panes}` : '';
  }

  // ---- photos ----
  function addFiles(list: FileList | File[]) {
    for (const f of Array.from(list)) {
      if (!f.type.startsWith('image/') && !/\.(heic|heif)$/i.test(f.name)) continue;
      if (photos.length >= MAX_PHOTOS) { err.textContent = T.tooMany; break; }
      photos.push(f);
    }
    photoInput.value = '';
    renderThumbs();
  }
  function renderThumbs() {
    thumbs.innerHTML = '';
    photos.forEach((f, i) => {
      const li = document.createElement('li');
      try { li.style.backgroundImage = `url("${URL.createObjectURL(f)}")`; } catch { /* preview not supported */ }
      const name = document.createElement('span');
      name.textContent = f.name;
      const rm = document.createElement('button');
      rm.type = 'button';
      rm.textContent = '✕';
      rm.setAttribute('aria-label', `${T.remove} ${f.name}`);
      rm.addEventListener('click', () => { photos.splice(i, 1); renderThumbs(); });
      li.append(name, rm);
      thumbs.appendChild(li);
    });
  }
  photoInput.addEventListener('change', () => { if (photoInput.files) addFiles(photoInput.files); });
  ['dragenter', 'dragover'].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.add('over'); }));
  ['dragleave', 'drop'].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.remove('over'); }));
  drop.addEventListener('drop', (e) => { const files = (e as DragEvent).dataTransfer?.files; if (files) addFiles(files); });

  show(0);
  summary();
  if (params.get('erreur')) err.textContent = T.failed;
}

// Shrink large photos in the browser before upload. Formats the browser can't read (e.g. HEIC outside Safari) are sent as they are.
async function shrink(file: File): Promise<File> {
  if (file.size < 600_000 || !/^image\/(jpeg|png|webp|heic|heif)$/.test(file.type)) return file;
  try {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, MAX_SIDE / Math.max(bmp.width, bmp.height));
    const w = Math.round(bmp.width * scale), h = Math.round(bmp.height * scale);
    const canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    canvas.getContext('2d')!.drawImage(bmp, 0, 0, w, h);
    const blob: Blob | null = await new Promise((r) => canvas.toBlob(r, 'image/jpeg', 0.82));
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], file.name.replace(/\.\w+$/, '') + '.jpg', { type: 'image/jpeg' });
  } catch {
    return file;
  }
}

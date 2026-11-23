// Business details and page addresses, in one place.
// Text shown on the site comes from the current GoHighLevel site (French and English versions).

export type Lang = 'fr' | 'en';

/** Set to true only at launch, after approval. While false, every page tells search engines not to index it. */
export const SITE_LIVE = false;

export const SITE_URL = 'https://solutionsclearshield.com';

export const business = {
  name: 'Solutions ClearShield',
  shortName: 'ClearShield',
  phone: '514-775-9418',
  phoneHref: 'tel:+15147759418',
  phoneIntl: '+1-514-775-9418',
  email: 'info@solutionsclearshield.com',
  instagram: 'https://www.instagram.com/solutionsclearshield/',
  city: { fr: 'Montréal (Québec)', en: 'Montreal, Quebec' },
  slogan: { fr: 'Protégez ce qui compte.', en: 'Protect what matters.' },
  areas: ['Montréal', 'Laval', 'Longueuil', 'Rive-Sud', 'Rive-Nord', 'Laurentides', 'Lanaudière', 'Montérégie'],
};

/** Every page, with its French and English address. Old GoHighLevel address "/" stays the French home page. */
export const routes = {
  home: { fr: '/', en: '/en/' },
  security: { fr: '/film-de-securite/', en: '/en/security-window-film/' },
  graffiti: { fr: '/film-anti-graffiti/', en: '/en/anti-graffiti-film/' },
  solar: { fr: '/film-solaire/', en: '/en/solar-window-film/' },
  privacyFilm: { fr: '/film-intimite-decoratif/', en: '/en/decorative-privacy-film/' },
  commercial: { fr: '/commercial/', en: '/en/commercial/' },
  residential: { fr: '/residentiel/', en: '/en/residential/' },
  quote: { fr: '/soumission/', en: '/en/quote/' },
  thanks: { fr: '/merci/', en: '/en/thank-you/' },
  privacy: { fr: '/confidentialite/', en: '/en/privacy/' },
  terms: { fr: '/conditions/', en: '/en/terms/' },
} as const;

export type RouteKey = keyof typeof routes;

export const filmOrder = ['security', 'graffiti', 'solar', 'privacyFilm'] as const;
export type FilmKey = (typeof filmOrder)[number];

type T = { fr: string; en: string };
type TL = { fr: string[]; en: string[] };

export interface Film {
  key: FilmKey;
  formValue: string;
  visual: 'sec' | 'gra' | 'sol' | 'pri';
  kicker: T;
  name: T;
  tail: T;
  short: T;
  lede: T;
  benefits: TL;
  idealFor?: TL;
  finishes?: TL;
  metaTitle: T;
  metaDescription: T;
  faq: { q: T; a: T }[];
}

const sharedFaq = [
  {
    q: { fr: 'Peut-on poser ce film sur des fenêtres thermos?', en: 'Can it go on sealed double-pane (thermos) windows?' },
    a: {
      fr: "Ça dépend du verre. Tous les films ne conviennent pas à tous les verres : un mauvais choix, surtout sur une fenêtre thermos, peut causer un stress thermique. On identifie votre type de verre lors de la visite et on ne retient que les films compatibles.",
      en: 'It depends on the glass. Not every film suits every glass: the wrong choice, especially on a sealed double-pane window, can cause thermal stress. We identify your glass type during the visit and keep only compatible films.',
    },
  },
  {
    q: { fr: 'Pouvez-vous faire une soumission à partir de photos?', en: 'Can you quote from photos?' },
    a: {
      fr: "Les photos nous aident à préparer la visite, mais on mesure chaque fenêtre sur place, avec précision. Pas d'estimation à l'aveugle : votre prix repose sur vos vraies vitres.",
      en: 'Photos help us prepare the visit, but we measure every window on site, precisely. No guesswork: your price is based on your actual windows.',
    },
  },
  {
    q: { fr: 'Combien ça coûte?', en: 'How much does it cost?' },
    a: {
      fr: "Chaque projet est différent. Après l'évaluation gratuite sur place, vous recevez une soumission détaillée par courriel, gratuite et sans engagement.",
      en: 'Every project is different. After the free on-site assessment, you receive a detailed quote by email, free and without obligation.',
    },
  },
];

export const films: Record<FilmKey, Film> = {
  security: {
    key: 'security',
    formValue: 'securite',
    visual: 'sec',
    kicker: { fr: 'Sécurité', en: 'Security' },
    name: { fr: 'Film de sécurité', en: 'Security film' },
    tail: { fr: '& anti-effraction', en: '& break-in deterrent' },
    short: {
      fr: "Retient le verre à l'impact et fait échouer les vols éclair. Transparent et invisible.",
      en: 'Holds the glass together on impact and stops smash-and-grabs. Clear and invisible.',
    },
    lede: {
      fr: "Un vol éclair prend quelques secondes, et le verre ordinaire n'offre aucune résistance. Le film de sécurité retient les éclats et force l'intrus à frapper encore et encore. Ce délai, et le bruit qu'il cause, font échouer la plupart des tentatives.",
      en: 'A smash-and-grab takes seconds, and ordinary glass offers no resistance. Security film holds the shards in place and forces an intruder to strike again and again. That delay, and the noise it makes, stops most attempts.',
    },
    benefits: {
      fr: ["Retient le verre en cas d'impact ou de bris", 'Protège contre les éclats de verre', 'Transparent, invisible une fois posé'],
      en: ['Holds the glass together on impact or breakage', 'Protects people from flying glass', 'Clear and invisible once installed'],
    },
    idealFor: {
      fr: ['Vitrines', 'Portes vitrées', 'Portes-patio', 'Soupiraux', 'Bureaux'],
      en: ['Storefronts', 'Glass doors', 'Patio doors', 'Basement windows', 'Offices'],
    },
    metaTitle: {
      fr: 'Film de sécurité pour fenêtres à Montréal | Solutions ClearShield',
      en: 'Security Window Film in Montreal | Solutions ClearShield',
    },
    metaDescription: {
      fr: "Film de sécurité et anti-effraction pour vitrines, portes et fenêtres du Grand Montréal. Retient le verre à l'impact. Évaluation gratuite sur place.",
      en: 'Security and break-in deterrent film for storefronts, doors and windows across Greater Montreal. Holds glass together on impact. Free on-site assessment.',
    },
    faq: [
      {
        q: { fr: 'Le film sera-t-il visible?', en: 'Will the film be visible?' },
        a: { fr: 'Non. Le film de sécurité est transparent et invisible une fois posé.', en: 'No. Security film is clear and invisible once installed.' },
      },
      ...sharedFaq,
    ],
  },
  graffiti: {
    key: 'graffiti',
    formValue: 'graffiti',
    visual: 'gra',
    kicker: { fr: 'Anti-graffiti', en: 'Anti-graffiti' },
    name: { fr: 'Film anti-graffiti', en: 'Anti-graffiti film' },
    tail: { fr: 'pour vitrines et surfaces vitrées', en: 'for storefronts and glass' },
    short: {
      fr: "Une couche transparente posée sur le verre. En cas de vandalisme, c'est le film qu'on remplace, pas la vitre.",
      en: "A clear layer applied over the glass. After vandalism, it's the film that gets replaced, not the glass.",
    },
    lede: {
      fr: "Le film anti-graffiti est une couche protectrice transparente posée sur vos vitres. En cas de graffiti ou de vandalisme, c'est le film qu'on remplace, pas la vitre. On vous présente les produits offerts et leurs caractéristiques lors de la soumission.",
      en: "Anti-graffiti film is a clear protective layer applied over your glass. After graffiti or vandalism, it's the film that gets replaced, not the glass. We go over the available products and their specifications with you during the quote.",
    },
    benefits: {
      fr: ['Couche transparente posée sur le verre', 'Le film se remplace, la vitre reste', 'Posé sur mesure, vitre par vitre'],
      en: ['A clear layer over the glass', 'Replace the film, keep the glass', 'Fitted to measure, pane by pane'],
    },
    idealFor: {
      fr: ['Vitrines', 'Portes vitrées', 'Commerces', 'Façades vitrées'],
      en: ['Storefronts', 'Glass doors', 'Businesses', 'Glass façades'],
    },
    metaTitle: {
      fr: 'Film anti-graffiti pour vitrines à Montréal | Solutions ClearShield',
      en: 'Anti-Graffiti Window Film in Montreal | Solutions ClearShield',
    },
    metaDescription: {
      fr: "Film anti-graffiti transparent pour vitrines et surfaces vitrées du Grand Montréal. On remplace le film, pas la vitre. Évaluation gratuite sur place.",
      en: 'Clear anti-graffiti film for storefronts and glass across Greater Montreal. Replace the film, not the glass. Free on-site assessment.',
    },
    faq: [...sharedFaq],
  },
  solar: {
    key: 'solar',
    formValue: 'solaire',
    visual: 'sol',
    kicker: { fr: 'Solaire', en: 'Solar' },
    name: { fr: 'Film solaire', en: 'Solar film' },
    tail: { fr: '& contrôle de la chaleur', en: '& heat control' },
    short: {
      fr: "Bloque la chaleur et l'éblouissement à la source. Même vue, même lumière.",
      en: 'Blocks heat and glare at the source. Same view, same light.',
    },
    lede: {
      fr: "Le verre non traité laisse entrer jusqu'à 80 % de la chaleur solaire. Le film de contrôle solaire la bloque à la source : même vue, même lumière, sans la chaleur, l'éblouissement ni les UV qui décolorent planchers et meubles.",
      en: 'Untreated glass lets in up to 80% of solar heat. Solar control film blocks it at the source: same view, same light, without the heat, the glare or the UV that fades floors and furniture.',
    },
    benefits: {
      fr: ["Pièces plus fraîches l'été", 'Moins de climatisation, factures réduites', "Moins d'éblouissement sur les écrans", 'Jusqu\'à 99 % des UV bloqués'],
      en: ['Cooler rooms in summer', 'Less A/C and lower energy bills', 'Less glare on screens', 'Up to 99% of UV blocked'],
    },
    idealFor: {
      fr: ['Maisons', 'Condos', 'Bureaux', 'Commerces', 'Façades vitrées'],
      en: ['Homes', 'Condos', 'Offices', 'Businesses', 'Glass façades'],
    },
    metaTitle: {
      fr: 'Film solaire pour fenêtres à Montréal | Solutions ClearShield',
      en: 'Solar Window Film in Montreal | Solutions ClearShield',
    },
    metaDescription: {
      fr: "Film solaire pour maisons, condos et bureaux du Grand Montréal. Moins de chaleur, d'éblouissement et d'UV. Évaluation gratuite sur place.",
      en: 'Solar window film for homes, condos and offices across Greater Montreal. Less heat, glare and UV. Free on-site assessment.',
    },
    faq: [
      {
        q: { fr: 'Est-ce que ça change la vue?', en: 'Does it change the view?' },
        a: { fr: 'Le film bloque la chaleur à la source : même vue, même lumière.', en: 'The film blocks heat at the source: same view, same light.' },
      },
      ...sharedFaq,
    ],
  },
  privacyFilm: {
    key: 'privacyFilm',
    formValue: 'intimite',
    visual: 'pri',
    kicker: { fr: 'Intimité & décoratif', en: 'Privacy & decorative' },
    name: { fr: "Film d'intimité", en: 'Privacy film' },
    tail: { fr: 'givré & décoratif', en: 'frosted & decorative' },
    short: {
      fr: 'Bloque la vue de l\'extérieur sans sacrifier la lumière. Découpé sur mesure.',
      en: 'Blocks the view from outside while keeping the light. Cut to measure.',
    },
    lede: {
      fr: "Bloquez la vue de l'extérieur sans sacrifier la lumière naturelle. Plus besoin de stores ni de rideaux : un fini net et professionnel, découpé sur mesure pour vos vitres, jusqu'à votre logo.",
      en: 'Block the view from outside without giving up natural light. No more blinds or curtains: a clean, professional finish, cut to fit your windows, right down to your logo.',
    },
    benefits: {
      fr: ['Intimité sans perdre la lumière', 'Givré ou opaque : intimité jour et nuit', 'Découpe sur mesure, logos et motifs'],
      en: ['Privacy without losing light', 'Frosted or opaque: privacy day and night', 'Custom cuts, logos and patterns'],
    },
    finishes: {
      fr: ['Givré', 'Blanc opaque', 'Noir opaque', 'Perforé', 'Effet miroir', 'Logos & motifs'],
      en: ['Frosted', 'White-out', 'Black-out', 'Perforated', 'One-way mirror', 'Logos & patterns'],
    },
    metaTitle: {
      fr: "Film d'intimité givré et décoratif à Montréal | Solutions ClearShield",
      en: 'Frosted & Decorative Privacy Film in Montreal | Solutions ClearShield',
    },
    metaDescription: {
      fr: "Film givré, opaque, perforé ou avec logo pour bureaux, commerces et maisons du Grand Montréal. Intimité sans perdre la lumière. Évaluation gratuite.",
      en: 'Frosted, opaque, perforated or logo film for offices, businesses and homes across Greater Montreal. Privacy without losing light. Free assessment.',
    },
    faq: [
      {
        q: { fr: 'Peut-on y mettre notre logo?', en: 'Can you add our logo?' },
        a: { fr: 'Oui. Le film est découpé sur mesure pour vos vitres, logos et motifs compris.', en: 'Yes. The film is cut to fit your windows, logos and patterns included.' },
      },
      ...sharedFaq,
    ],
  },
};

export const steps = [
  {
    title: { fr: 'Appel découverte', en: 'Discovery call' },
    sub: { fr: 'On comprend ce que vous voulez régler.', en: 'We learn what you want to solve.' },
    body: {
      fr: 'Un court appel pour cerner vos objectifs : sécurité, chaleur, intimité ou un peu de tout. On répond à vos premières questions et on planifie une visite au moment qui vous convient.',
      en: 'A short call to pin down your goals: security, heat, privacy or a bit of everything. We answer your first questions and book a visit at a time that suits you.',
    },
  },
  {
    title: { fr: 'Visite et mesures', en: 'Visit and measurements' },
    sub: { fr: 'On se déplace, gratuitement.', en: 'We come to you, free of charge.' },
    body: {
      fr: "On mesure chaque fenêtre sur place, avec précision. Pas d'estimation à l'aveugle à partir de photos, pas de soumission générique : votre prix repose sur vos vraies vitres.",
      en: 'We measure every window on site, precisely. No guesswork from photos, no generic quote: your price is based on your actual windows.',
    },
  },
  {
    title: { fr: 'Analyse du verre', en: 'Glass analysis' },
    sub: { fr: 'On vérifie la compatibilité des films.', en: 'We check which films are compatible.' },
    body: {
      fr: "Tous les films ne conviennent pas à tous les verres. Un mauvais choix, surtout sur une fenêtre thermos, peut causer un stress thermique. On identifie votre type de verre et on ne retient que les films compatibles. C'est l'étape que d'autres sautent.",
      en: "Not every film suits every glass. The wrong choice, especially on a sealed double-pane window, can cause thermal stress. We identify your glass type and keep only compatible films. It's the step others skip.",
    },
  },
  {
    title: { fr: 'Options et soumission', en: 'Options and quote' },
    sub: { fr: 'Un prix clair, par courriel.', en: 'A clear price, by email.' },
    body: {
      fr: 'On vous présente les options qui conviennent, on explique les avantages de chacune et on répond à vos questions. Vous recevez ensuite une soumission détaillée par courriel, gratuite et sans engagement.',
      en: 'We present the options that fit, explain the benefits of each and answer your questions. You then receive a detailed quote by email, free and without obligation.',
    },
  },
];

export const whyUs = [
  { title: { fr: 'Certifié XPEL', en: 'XPEL certified' }, body: { fr: 'Films architecturaux haut de gamme, posés par des mains certifiées.', en: 'Premium architectural films, installed by certified hands.' } },
  { title: { fr: "5 ans d'expérience", en: '5 years of experience' }, body: { fr: 'Résidentiel et commercial, partout dans le Grand Montréal.', en: 'Residential and commercial, across Greater Montreal.' } },
  { title: { fr: 'Pose impeccable', en: 'Flawless install' }, body: { fr: 'Découpe précise, bords nets, aucune bulle.', en: 'Precise cuts, clean edges, no bubbles.' } },
  { title: { fr: 'Évaluation gratuite', en: 'Free assessment' }, body: { fr: 'On se déplace et on mesure, sans engagement.', en: 'We come to you and measure, with no obligation.' } },
];

export const segments = {
  commercial: {
    key: 'commercial' as const,
    kicker: { fr: 'Commercial', en: 'Commercial' },
    title: { fr: 'Vitrines, bureaux et façades vitrées', en: 'Storefronts, offices and glass façades' },
    body: {
      fr: 'Sécurité contre les vols éclair, contrôle de la chaleur, intimité pour vos espaces de travail et protection de vos vitrines.',
      en: 'Protection against smash-and-grabs, heat control, privacy for your workspaces and protection for your storefront glass.',
    },
    tags: { fr: ['Vitrines', 'Bureaux', 'Commerces', 'Façades vitrées'], en: ['Storefronts', 'Offices', 'Businesses', 'Glass façades'] },
    films: ['security', 'graffiti', 'solar', 'privacyFilm'] as FilmKey[],
    metaTitle: { fr: 'Films pour fenêtres commerciales à Montréal | Solutions ClearShield', en: 'Commercial Window Film in Montreal | Solutions ClearShield' },
    metaDescription: {
      fr: "Films de sécurité, anti-graffiti, solaires et d'intimité pour vitrines, bureaux et commerces du Grand Montréal. Évaluation gratuite sur place.",
      en: 'Security, anti-graffiti, solar and privacy film for storefronts, offices and businesses across Greater Montreal. Free on-site assessment.',
    },
  },
  residential: {
    key: 'residential' as const,
    kicker: { fr: 'Résidentiel', en: 'Residential' },
    title: { fr: 'Maisons, condos et portes-patio', en: 'Homes, condos and patio doors' },
    body: {
      fr: "Pièces plus fraîches l'été, intimité sans perdre la lumière, et des vitres qui retiennent le verre en cas de bris.",
      en: 'Cooler rooms in summer, privacy without losing light, and glass that stays in place if it breaks.',
    },
    tags: { fr: ['Maisons', 'Condos', 'Portes-patio', 'Soupiraux'], en: ['Homes', 'Condos', 'Patio doors', 'Basement windows'] },
    films: ['security', 'solar', 'privacyFilm'] as FilmKey[],
    metaTitle: { fr: 'Films pour fenêtres résidentielles à Montréal | Solutions ClearShield', en: 'Residential Window Film in Montreal | Solutions ClearShield' },
    metaDescription: {
      fr: "Films solaires, de sécurité et d'intimité pour maisons et condos du Grand Montréal. Évaluation gratuite sur place, service bilingue.",
      en: 'Solar, security and privacy film for homes and condos across Greater Montreal. Free on-site assessment, bilingual service.',
    },
  },
};

export function t<V>(v: { fr: V; en: V }, lang: Lang): V {
  return v[lang];
}

export function other(lang: Lang): Lang {
  return lang === 'fr' ? 'en' : 'fr';
}

// Photos: the same Unsplash photos as the current GoHighLevel site (free for commercial use, Unsplash License).
// Replace with real ClearShield project photos when available: drop the file in src/assets/photos and point to it here.
import type { ImageMetadata } from 'astro';
import salon from '../assets/photos/salon-fenetres.jpg';
import brise from '../assets/photos/verre-brise.jpg';
import soleil from '../assets/photos/soleil-store.jpg';
import givre from '../assets/photos/verre-givre.jpg';
import type { FilmKey } from './site';

export interface Photo { src: ImageMetadata; alt: { fr: string; en: string }; position?: string }

export const photos = {
  salon: { src: salon, alt: { fr: 'Salon avec de grandes fenêtres du plancher au plafond', en: 'Living room with floor-to-ceiling windows' }, position: '50% 45%' },
  brise: { src: brise, alt: { fr: 'Vitre fissurée', en: 'Cracked glass' }, position: '60% 40%' },
  soleil: { src: soleil, alt: { fr: 'Rayons de soleil à travers des stores', en: 'Sun rays streaming through blinds' }, position: '50% 45%' },
  givre: { src: givre, alt: { fr: 'Verre givré texturé', en: 'Textured frosted glass' }, position: '50% 30%' },
} satisfies Record<string, Photo>;

export const filmPhoto: Record<FilmKey, Photo | null> = {
  security: photos.brise,
  graffiti: null,
  solar: photos.soleil,
  privacyFilm: photos.givre,
};

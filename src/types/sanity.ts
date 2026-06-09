import type { PortableTextBlock } from '@portabletext/types';
import type { ImageAsset } from 'sanity';

export interface Benefit {
  metric: string;
  label: string;
  description?: string;
}

export interface GalleryImage {
  image: ImageAsset;
  alt?: string;
}

export interface Solucion {
  _id: string;
  title: string;
  slug: string;
  tagline: string;
  bajada?: string;
  description?: PortableTextBlock[];
  features: string[];
  featuresDescription?: string;
  mainImage?: ImageAsset;
  benefits?: Benefit[];
  galleryImages?: GalleryImage[];
  icon?: string;
  image?: ImageAsset;
  order?: number;
}

export interface CasoExito {
  _id: string;
  title: string;
  slug: string;
  client: string;
  industry: string;
  challenge: PortableTextBlock[];
  solution: PortableTextBlock[];
  results: string[];
  testimonial?: string;
  testimonialAuthor?: string;
  image?: ImageAsset;
}

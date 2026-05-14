import type { PortableTextBlock } from '@portabletext/types';
import type { ImageAsset } from 'sanity';

export interface Solucion {
  _id: string;
  title: string;
  slug: string;
  tagline: string;
  description: PortableTextBlock[];
  features: string[];
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

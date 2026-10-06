import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'solucion',
  title: 'Solución / Sistema',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'Frase corta que describe el sistema (1 línea)',
    }),
    defineField({
      name: 'bajada',
      title: 'Bajada',
      type: 'text',
      description: 'Párrafo introductorio debajo del título (2-3 líneas)',
      rows: 3,
    }),
    defineField({
      name: 'description',
      title: 'Descripción',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Descripción detallada en Portable Text',
    }),
    defineField({
      name: 'features',
      title: 'Características',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Lista de features principales',
    }),
    defineField({
      name: 'featuresDescription',
      title: 'Descripción de características',
      type: 'string',
      description: 'Texto introductorio para la sección de características',
    }),
    defineField({
      name: 'mainImage',
      title: 'Imagen principal / Hero',
      type: 'image',
      options: { hotspot: true },
      description: 'Imagen destacada que aparece al inicio de la página',
    }),
    defineField({
      name: 'benefits',
      title: 'Beneficios medibles',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'metric',
              title: 'Métrica',
              type: 'string',
              description: 'Ej: "60%", "100%", "3x"',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'label',
              title: 'Etiqueta',
              type: 'string',
              description: 'Ej: "Reducción en tiempos operativos"',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Descripción',
              type: 'string',
              description: 'Detalle opcional del beneficio',
            }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'metric' },
          },
        },
      ],
      description: 'Métricas y beneficios cuantificables del sistema',
    }),
    defineField({
      name: 'galleryImages',
      title: 'Imágenes de galería',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'image',
              title: 'Imagen',
              type: 'image',
              options: { hotspot: true },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'alt',
              title: 'Texto alternativo',
              type: 'string',
              description: 'Descripción de la imagen para accesibilidad',
            }),
          ],
          preview: {
            select: { media: 'image', title: 'alt' },
          },
        },
      ],
      description: 'Imágenes adicionales para la galería de la página',
    }),
    defineField({
      name: 'icon',
      title: 'Icono (emoji o clase)',
      type: 'string',
      description: 'Emoji o identificador de icono para la card',
    }),
    defineField({
      name: 'image',
      title: 'Imagen destacada',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'order',
      title: 'Orden de aparición',
      type: 'number',
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: 'Orden',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'title', subtitle: 'tagline', media: 'image' },
  },
});

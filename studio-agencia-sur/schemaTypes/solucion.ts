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

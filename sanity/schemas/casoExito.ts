import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'casoExito',
  title: 'Caso de Éxito',
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
      name: 'client',
      title: 'Cliente',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'industry',
      title: 'Industria',
      type: 'string',
      options: {
        list: [
          { title: 'Banca / Finanzas', value: 'banca' },
          { title: 'Retail', value: 'retail' },
          { title: 'Salud', value: 'salud' },
          { title: 'Gobierno', value: 'gobierno' },
          { title: 'Logística', value: 'logistica' },
          { title: 'Educación', value: 'educacion' },
          { title: 'Otro', value: 'otro' },
        ],
      },
    }),
    defineField({
      name: 'challenge',
      title: 'Desafío',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Qué problema tenía el cliente',
    }),
    defineField({
      name: 'solution',
      title: 'Solución',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Qué implementamos',
    }),
    defineField({
      name: 'results',
      title: 'Resultados',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Métricas o resultados concretos (ej: "Reducción 40% tiempo de aprobación")',
    }),
    defineField({
      name: 'testimonial',
      title: 'Testimonio',
      type: 'text',
      description: 'Cita del cliente',
    }),
    defineField({
      name: 'testimonialAuthor',
      title: 'Autor del testimonio',
      type: 'string',
      description: 'Nombre y cargo',
    }),
    defineField({
      name: 'image',
      title: 'Imagen',
      type: 'image',
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'client', media: 'image' },
  },
});

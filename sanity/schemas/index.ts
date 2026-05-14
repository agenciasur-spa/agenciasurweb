import { defineType } from 'sanity';

export default defineType({
  name: 'schema',
  title: 'Schemas',
  type: 'array',
  of: [{ type: 'reference', to: [] }],
});

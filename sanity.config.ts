import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import solucion from './schemas/solucion';
import casoExito from './schemas/casoExito';

export default defineConfig({
  name: 'agenciasurweb',
  title: 'Agencia Sur - CMS',
  projectId: process.env.SANITY_PROJECT_ID || '',
  dataset: process.env.SANITY_DATASET || 'production',
  plugins: [structureTool()],
  schema: {
    types: [solucion, casoExito],
  },
});

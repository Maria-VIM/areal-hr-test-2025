import { fileURLToPath, URL } from 'node:url';
import dotenv from 'dotenv';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import * as path from 'node:path';

const envPath = path.resolve(process.cwd(), '../.env');
dotenv.config({ path: envPath });
// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: process.env.VUEPORT ? parseInt(process.env.VUEPORT, 10) : 5000,
    host: true,
  },
  define: {
    'import.meta.env.API': JSON.stringify(process.env.API),
    'import.meta.env.VUEPORT': JSON.stringify(process.env.VUEPORT),
  },
});

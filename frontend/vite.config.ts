// vite.config.ts

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(async () => ({
  plugins: [
    react(),
    tailwindcss(),
  ],
}));

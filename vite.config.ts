/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages serves the project site under /<repo>/.
// Override with BASE_PATH=/ for local custom-domain builds if needed.
const base = process.env.BASE_PATH ?? '/cryptic-crossword-trainer/';

export default defineConfig({
  base,
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
});

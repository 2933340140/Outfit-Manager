import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.js'),
      name: 'OutfitManager',
      fileName: () => 'index.js',
      formats: ['iife'],
    },
    outDir: '.',   // output to root
    emptyOutDir: false,
    rollupOptions: {
      output: {
        // Vite IIFE format already wraps in IIFE, no need for extra wrapper
      },
    },
    minify: false,
    sourcemap: false,
  },
});

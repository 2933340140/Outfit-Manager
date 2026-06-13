import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    // Use regular app build, not library mode
    // This produces a plain script that self-executes
    rollupOptions: {
      input: path.resolve(__dirname, 'src/index.js'),
      output: {
        entryFileNames: 'index.js',
        format: 'iife',
        name: undefined, // no global variable assignment
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
    minify: false,
    sourcemap: false,
  },
});

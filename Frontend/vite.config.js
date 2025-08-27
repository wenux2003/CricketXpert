import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // default Vite port, you can change if needed
    open: true, // opens browser automatically
  },
  resolve: {
    alias: {
      '@': '/src', // optional, allows using @/components instead of ../../components
    },
  },
});

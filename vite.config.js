import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Definimos el target de compilación a 'es2020' para asegurar compatibilidad
    // con `import.meta.env`. Esto es crucial para la versión de producción.
    target: 'es2020',
  },
});

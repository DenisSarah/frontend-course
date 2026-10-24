import { defineConfig } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';

export default defineConfig(({ mode }) => ({
  cacheDir: `node_modules/.vite/${mode}`,
  plugins: [
    react(),
    ...(mode === 'compiler' ? [babel({ presets: [reactCompilerPreset()] })] : []),
  ],
}));

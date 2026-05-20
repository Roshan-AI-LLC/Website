import { defineConfig, type UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

type SSGConfig = UserConfig & {
  ssgOptions?: {
    script?: 'sync' | 'async' | 'defer' | 'async defer';
    dirStyle?: 'flat' | 'nested';
    formatting?: 'prettify' | 'none';
  };
};

const config: SSGConfig = {
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    host: true,
  },
  build: {
    target: 'es2020',
    sourcemap: false,
    cssMinify: 'lightningcss',
  },
  ssgOptions: {
    script: 'async',
    dirStyle: 'nested',
    formatting: 'none',
  },
};

export default defineConfig(config);

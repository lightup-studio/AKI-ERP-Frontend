/// <reference types="vitest" />
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import svgr from 'vite-plugin-svgr';
import viteTsConfigPaths from 'vite-tsconfig-paths';

import react from '@vitejs/plugin-react';

import parseEnv from './vite/utilsEnv';

export default defineConfig(({ command, mode }) => {
  console.log('command', command);
  console.log('mode', mode);

  const env = parseEnv(
    loadEnv(mode, process.cwd() + '/environments', ['APP', 'VITE'])
  );
  console.log('env', env);

  return {
    cacheDir: './node_modules/.vite/aki-erp',
    envDir: './environments',
    envPrefix: ['APP', 'VITE'],

    server: {
      port: 4200,
      host: 'localhost',
      proxy: {
        '/api': {
          target: env.VITE_MOCK_ENABLE ? '/' : env.APP_BASE_URL?.toString(),
          changeOrigin: true,
          secure: false,
        },
      },
    },

    preview: {
      port: 4300,
      host: 'localhost',
    },

    resolve: {
      alias: {
        assets: path.resolve(__dirname, './src/assets'),
      },
    },

    plugins: [
      react(),
      viteTsConfigPaths({
        root: './',
      }),
      svgr(),
    ],

    // Uncomment this if you are using workers.
    // worker: {
    //  plugins: [
    //    viteTsConfigPaths({
    //      root: './',
    //    }),
    //  ],
    // },

    test: {
      globals: true,
      cache: {
        dir: './node_modules/.vitest',
      },
      environment: 'jsdom',
      include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    },
  };
});

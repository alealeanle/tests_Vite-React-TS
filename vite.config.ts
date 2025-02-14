import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@api': path.resolve(__dirname, 'src/api'),
      '@commons': path.resolve(__dirname, 'src/components/commons'),
      '@redux': path.resolve(__dirname, 'src/redux'),
      '@models': path.resolve(__dirname, 'src/redux/models'),
      '@sagas': path.resolve(__dirname, 'src/redux/sagas'),
      '@store': path.resolve(__dirname, 'src/redux/store'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@pages': path.resolve(__dirname, 'src/components/pages'),
      '@HomePage': path.resolve(__dirname, 'src/components/pages/HomePage'),
      '@EditPage': path.resolve(__dirname, 'src/components/pages/EditPage'),
      '@TestForm': path.resolve(
        __dirname,
        'src/components/pages/EditPage/TestForm/',
      ),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "/src/styles/global" as *;`,
      },
    },
  },
});

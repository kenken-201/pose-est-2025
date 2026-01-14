import { cloudflare } from '@cloudflare/vite-plugin';
import { reactRouter } from '@react-router/dev/vite';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    // Cloudflare Workers ランタイムでサーバーコードを実行
    cloudflare({ viteEnvironment: { name: 'ssr' } }),
    reactRouter(),
    tsconfigPaths(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './app'),
    },
  },
  build: {
    // クライアント側でサーバーコードが見える（セキュリティリスク）
    // ファイルサイズが増加、などの懸念があるため本番環境では無効化
    sourcemap: false,
  },
  optimizeDeps: {
    include: ['react', 'react-dom/client', 'react-router-dom', 'react-router'],
  },
});

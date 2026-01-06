import type { Config } from "@react-router/dev/config";

/**
 * React Router v7 設定
 *
 * Cloudflare Workers でのSSR動作に必要な設定:
 * - ssr: true - サーバーサイドレンダリングを有効化
 * - future.unstable_viteEnvironmentApi: true - Cloudflare Vite プラグインとの互換性
 */
export default {
  ssr: true,
  future: {
    v8_viteEnvironmentApi: true,
  },
} satisfies Config;


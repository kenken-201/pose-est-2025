/**
 * Cloudflare Workers エントリーポイント
 *
 * React Router v7 の SSR リクエストを処理するための fetch ハンドラー。
 * このファイルは Wrangler によってビルドされ、Cloudflare Workers 上で実行されます。
 */
import { createRequestHandler } from "react-router";

/**
 * Cloudflare 環境の型定義
 * バインディング（KV, R2, D1 など）を使用する場合はここに追加
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type Env = Record<string, unknown>;

/**
 * React Router のリクエストハンドラーを作成
 * virtual:react-router/server-build から SSR ビルドをインポート
 */
const requestHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE
);

/**
 * Cloudflare Workers の fetch ハンドラー
 * すべてのリクエストを React Router に委譲
 */
export default {
  async fetch(request, env, ctx) {
    return requestHandler(request, {
      cloudflare: { env, ctx },
    });
  },
} satisfies ExportedHandler<Env>;

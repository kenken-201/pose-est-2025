/**
 * Cloudflare Workers エントリーポイント
 *
 * React Router v7 の SSR リクエストを処理するための fetch ハンドラー。
 * このファイルは Wrangler によってビルドされ、Cloudflare Workers 上で実行されます。
 */
import { createRequestHandler } from 'react-router';
import { applySecurityHeaders } from './utils/security-headers';

/**
 * Cloudflare Workers 環境変数の型定義
 *
 * wrangler.jsonc の vars セクションで定義された環境変数。
 * バインディング（KV, R2, D1 など）を使用する場合もここに追加する。
 *
 * @see https://developers.cloudflare.com/workers/runtime-apis/bindings/
 */
interface Env {
  /** バックエンド API のベース URL */
  readonly VITE_API_BASE_URL: string;
  /** アプリケーション名（環境識別用） */
  readonly VITE_APP_NAME: string;
}

/**
 * React Router のリクエストハンドラーを作成
 *
 * virtual:react-router/server-build から SSR ビルドを動的インポートし、
 * 現在の実行モード（development/production）を渡す。
 */
const requestHandler = createRequestHandler(
  () => import('virtual:react-router/server-build'),
  import.meta.env.MODE
);

/**
 * Cloudflare Workers の fetch ハンドラー
 *
 * すべての HTTP リクエストを React Router に委譲し、
 * SSR レンダリングを実行する。
 *
 * @param request - 受信した HTTP リクエスト
 * @param env - Cloudflare 環境変数とバインディング
 * @param ctx - 実行コンテキスト（waitUntil など）
 * @returns SSR レンダリングされた HTTP レスポンス
 */
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const response = await requestHandler(request, {
      cloudflare: { env, ctx },
    });
    
    const newResponse = applySecurityHeaders(response);

    // HTML レスポンスの場合、キャッシュ無効化ヘッダーを付与
    // (SSR された最新の状態を常に返すため)
    if (newResponse.headers.get("Content-Type")?.includes("text/html")) {
      newResponse.headers.set("Cache-Control", "no-cache");
    }

    return newResponse;
  },
} satisfies ExportedHandler<Env>;

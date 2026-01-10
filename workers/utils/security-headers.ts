/**
 * Cloudflare Workers セキュリティヘッダー定義
 *
 * アプリケーションのセキュリティを強化するためのレスポンスヘッダー定義。
 * OWASP Secure Headers Project 推奨の設定に基づいています。
 */
export const SECURITY_HEADERS = {
  /** MIME タイプスニッフィングを無効化 */
  "X-Content-Type-Options": "nosniff",
  /** クリックジャッキング防止 (iframe での表示を拒否) */
  "X-Frame-Options": "DENY",
  /** クロスオリジンリクエスト時のリファラ送信を制限 */
  "Referrer-Policy": "strict-origin-when-cross-origin",
  /** 使用しないブラウザ機能（カメラ、マイクなど）を無効化 */
  "Permissions-Policy":
    "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  /** XSS フィルター有効化 (ブロックモード) - レガシーブラウザ向け */
  "X-XSS-Protection": "1; mode=block",
} as const;

/**
 * レスポンスにセキュリティヘッダーを適用する
 *
 * @param originalResponse - 元のレスポンスオブジェクト
 * @returns セキュリティヘッダーが適用された新しいレスポンスオブジェクト
 */
export function applySecurityHeaders(originalResponse: Response): Response {
  // レスポンスヘッダーを複製（immutable な場合があるため）
  const newHeaders = new Headers(originalResponse.headers);

  // 定義されたセキュリティヘッダーを適用
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    // 既存のヘッダーを強制的に上書きしてセキュリティを確保する方針
    newHeaders.set(key, value);
  });

  // 新しいヘッダーを持つレスポンスを再構築
  return new Response(originalResponse.body, {
    status: originalResponse.status,
    statusText: originalResponse.statusText,
    headers: newHeaders,
  });
}

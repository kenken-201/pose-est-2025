/**
 * Cloudflare Workers セキュリティヘッダー定義
 *
 * アプリケーションのセキュリティを強化するためのレスポンスヘッダー定義。
 * OWASP Secure Headers Project 推奨の設定に基づいています。
 */
export const SECURITY_HEADERS = {
  /**
   * Content Security Policy (CSP)
   * 信頼されたソースからのコンテンツのみ実行を許可し、XSS 攻撃を防止する
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy
   */
  'Content-Security-Policy':
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data:; " +
    "connect-src 'self' https://api.kenken-pose-est.online https://api-dev.kenken-pose-est.online https://cloudflareinsights.com; " +
    "media-src 'self' blob:; " +
    "frame-src 'self'; " +
    "object-src 'none'; " +
    "base-uri 'self'; " +
    "form-action 'self'; " +
    'upgrade-insecure-requests',
  /**
   * MIME タイプスニッフィングを無効化
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
   */
  'X-Content-Type-Options': 'nosniff',
  /**
   * クリックジャッキング防止 (iframe での表示を拒否)
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
   */
  'X-Frame-Options': 'DENY',
  /**
   * クロスオリジンリクエスト時のリファラ送信を制限
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
   */
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  /**
   * 使用しないブラウザ機能（カメラ、マイクなど）を無効化
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Permissions-Policy
   */
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  /**
   * XSS フィルター有効化 (ブロックモード) - レガシーブラウザ向け
   * @deprecated 現代のブラウザは CSP を使用しますが、古い端末サポートのために残しています
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-XSS-Protection
   */
  'X-XSS-Protection': '1; mode=block',
  /**
   * HTTP Strict Transport Security (HSTS)
   * HTTPS 接続を強制する (1年間)
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
   */
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
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

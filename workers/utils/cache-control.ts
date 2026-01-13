/**
 * HTML レスポンスに対する厳格なキャッシュ制御を適用する
 *
 * SSR された HTML はユーザー固有の状態や最新のデータを反映する必要があるため、
 * 以下の厳格なキャッシュ無効化ディレクティブを適用します:
 * - no-cache: キャッシュ使用前に必ず再検証を要求
 * - no-store: センシティブなデータを保存しない
 * - must-revalidate: 期限切れコンテンツの使用を禁止
 *
 * @param response - 対象のレスポンス
 * @returns キャッシュヘッダーが適用されたレスポンス (ミューテーションを伴う)
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control
 */
export function applyHtmlCacheHeaders(response: Response): Response {
  const contentType = response.headers.get('Content-Type');

  // Content-Type が text/html を含む場合のみ適用
  if (contentType && contentType.includes('text/html')) {
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  }

  return response;
}

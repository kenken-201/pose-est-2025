/**
 * HTML レスポンスに対するキャッシュ制御を適用する
 *
 * SSR された HTML はユーザー固有の状態や最新のデータを反映する必要があるため、
 * 原則としてキャッシュを無効化 (no-cache) します。
 *
 * @param response - 対象のレスポンス
 * @returns キャッシュヘッダーが適用されたレスポンス (ミューテーションを伴う)
 */
export function applyHtmlCacheHeaders(response: Response): Response {
  const contentType = response.headers.get("Content-Type");

  // Content-Type が text/html を含む場合のみ適用
  if (contentType && contentType.includes("text/html")) {
    response.headers.set("Cache-Control", "no-cache");
  }

  return response;
}

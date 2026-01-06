import type { EntryContext } from "react-router";
import { ServerRouter } from "react-router";
import { renderToString } from "react-dom/server";

/**
 * サーバーサイドレンダリング（SSR/SPA プリレンダリング）のエントリーポイント
 * 
 * React Router v7 のビルド時にこの関数が呼び出され、
 * 初期HTMLを生成します。SPAモードの場合でも、ビルド時に
 * ルートルートのHTMLをプリレンダリングするために使用されます。
 */
export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext
) {
  const html = renderToString(
    <ServerRouter context={routerContext} url={request.url} />
  );

  responseHeaders.set("Content-Type", "text/html");

  return new Response(`<!DOCTYPE html>${html}`, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}

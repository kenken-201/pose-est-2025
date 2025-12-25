import type { EntryContext } from "react-router";

export default function handleRequest(
  _request: Request, // 現状未使用のためアンダースコアを付与
  responseStatusCode: number,
  responseHeaders: Headers,
  _context: EntryContext
) {
  return new Response("<!DOCTYPE html>", {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}

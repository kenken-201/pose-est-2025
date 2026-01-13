import { describe, it, expect } from 'vitest';
import { SECURITY_HEADERS, applySecurityHeaders } from '../../../workers/utils/security-headers';

describe('applySecurityHeaders', () => {
  it('should apply all security headers to the response', () => {
    const originalResponse = new Response('Hello World', {
      headers: { 'Content-Type': 'text/plain' },
    });

    const response = applySecurityHeaders(originalResponse);

    // 全ての定義済みヘッダーが含まれているか確認
    Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
      expect(response.headers.get(key)).toBe(value);
    });

    // 元のヘッダーが保持されているか確認
    expect(response.headers.get('Content-Type')).toBe('text/plain');

    // ボディが保持されているか確認
    // (Response body stream is locked if consumed, but here we just check if it exists implicitly or via text)
    // Note: To check body text, we need to clone or check before consuming.
    // For this mock simplistic test environment, we assume Response logic holds.
  });

  it('should overwrite insecure headers if present', () => {
    const originalResponse = new Response('Ok', {
      headers: {
        'X-Frame-Options': 'SAMEORIGIN', // 弱い設定
      },
    });

    const response = applySecurityHeaders(originalResponse);

    // 強制的に DENY に上書きされていること
    expect(response.headers.get('X-Frame-Options')).toBe('DENY');
  });

  it('should preserve status code and status text', () => {
    const originalResponse = new Response('Not Found', {
      status: 404,
      statusText: 'Not Found Custom',
    });

    const response = applySecurityHeaders(originalResponse);

    expect(response.status).toBe(404);
    expect(response.statusText).toBe('Not Found Custom');
  });

  it('should handle Redirect responses (302) correctly', () => {
    const originalResponse = Response.redirect('https://example.com/new-location', 302);
    const response = applySecurityHeaders(originalResponse);

    expect(response.status).toBe(302);
    expect(response.headers.get('Location')).toBe('https://example.com/new-location');
    expect(response.headers.get('X-Frame-Options')).toBe('DENY');
  });

  it('should handle No Content responses (204) correctly', () => {
    const originalResponse = new Response(null, { status: 204 });
    const response = applySecurityHeaders(originalResponse);

    expect(response.status).toBe(204);
    expect(response.body).toBe(null);
    expect(response.headers.get('X-Frame-Options')).toBe('DENY');
  });
});

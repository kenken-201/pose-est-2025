import { describe, it, expect } from 'vitest';
import { applyHtmlCacheHeaders } from '../../../workers/utils/cache-control';

describe('applyHtmlCacheHeaders', () => {
  it('should add strict no-cache headers to HTML responses', () => {
    const response = new Response('<html>...</html>', {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });

    applyHtmlCacheHeaders(response);

    // 厳格なキャッシュ無効化: no-cache, no-store, must-revalidate
    expect(response.headers.get('Cache-Control')).toBe('no-cache, no-store, must-revalidate');
  });

  it('should NOT add cache header to non-HTML responses', () => {
    const response = new Response('{}', {
      headers: { 'Content-Type': 'application/json' },
    });

    applyHtmlCacheHeaders(response);

    expect(response.headers.get('Cache-Control')).toBeNull();
  });

  it('should handle missing Content-Type header gracefully', () => {
    const response = new Response('Unknown content');
    // No Content-Type set

    applyHtmlCacheHeaders(response);

    expect(response.headers.get('Cache-Control')).toBeNull();
  });
});

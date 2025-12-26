import { describe, it, expect } from 'vitest';
import { VideoUploadRequestSchema, VideoProcessResponseSchema } from '@/lib/api/types';

describe('API Types', () => {
    describe('VideoUploadRequestSchema', () => {
        it('should validate a valid video file', () => {
            const file = new File(['dummy content'], 'test.mp4', { type: 'video/mp4' });
            // File objects in Node environment might be tricky without setup, 
            // but assuming jsdom or happy-dom is used, this should work.
            // For now, we rely on the schema definition logic.

            const result = VideoUploadRequestSchema.safeParse({ video: file });
            expect(result.success).toBe(true);
        });

        it('should reject invalid file types', () => {
            const file = new File(['dummy'], 'test.txt', { type: 'text/plain' });
            const result = VideoUploadRequestSchema.safeParse({ video: file });
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.errors[0].message).toContain('対応していないファイル形式');
            }
        });
    });

    describe('VideoProcessResponseSchema', () => {
        it('should validate valid response data', () => {
            const data = {
                processedVideoUrl: 'https://example.com/video.mp4',
                processingTimeMs: 1234,
                metadata: { width: 1920, height: 1080 }
            };
            const result = VideoProcessResponseSchema.safeParse(data);
            expect(result.success).toBe(true);
        });

        it('should reject invalid URLs', () => {
            const data = {
                processedVideoUrl: 'not-a-url',
            };
            const result = VideoProcessResponseSchema.safeParse(data);
            expect(result.success).toBe(false);
        });
    });
});

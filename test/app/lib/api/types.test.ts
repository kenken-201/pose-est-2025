import { describe, it, expect } from 'vitest';
import { VideoUploadRequestSchema, VideoProcessResponseSchema } from '@/lib/api/types';

describe('API Types', () => {
    describe('VideoUploadRequestSchema', () => {
        it('should validate a valid video file', () => {
            const file = new File(['dummy content'], 'test.mp4', { type: 'video/mp4' });
            // File objects in Node environment might be tricky without setup, 
            // but assuming jsdom or happy-dom is used, this should work.
            // For now, we rely on the schema definition logic.

            const result = VideoUploadRequestSchema.safeParse({ file: file });
            expect(result.success).toBe(true);
        });

        it('should reject invalid file types', () => {
            const file = new File(['dummy'], 'test.txt', { type: 'text/plain' });
            const result = VideoUploadRequestSchema.safeParse({ file: file });
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.errors[0].message).toContain('対応していないファイル形式');
            }
        });
    });

    describe('VideoProcessResponseSchema', () => {
        it('should validate valid response data', () => {
            const data = {
                signed_url: 'https://example.com/video.mp4',
                video_meta: {
                    width: 1920,
                    height: 1080,
                    fps: 30,
                    duration_sec: 10,
                    has_audio: false,
                },
                total_poses: 150,
                processing_time_sec: 2.5,
            };
            const result = VideoProcessResponseSchema.safeParse(data);
            if (!result.success) {
                console.error('Validation failed:', JSON.stringify(result.error, null, 2));
            }
            expect(result.success).toBe(true);
        });

        it('should reject invalid URLs', () => {
            const data = {
                signed_url: 'not-a-url',
                video_meta: {
                    width: 1920,
                    height: 1080,
                    fps: 30,
                    duration_sec: 10,
                    has_audio: false,
                },
                total_poses: 150,
                processing_time_sec: 2.5,
            };
            const result = VideoProcessResponseSchema.safeParse(data);
            expect(result.success).toBe(false);
        });
    });
});

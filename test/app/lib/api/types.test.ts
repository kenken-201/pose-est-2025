import { describe, it, expect } from 'vitest';
import { VideoUploadRequestSchema, VideoProcessResponseSchema } from '@/lib/api/types';

/**
 * API 型定義（Zod スキーマ）のテスト
 *
 * バックエンドとの通信で使用する型定義のバリデーション機能を検証します。
 * Zod スキーマによるランタイムバリデーションが正しく動作することを確認します。
 */
describe('API Types', () => {
  /**
   * VideoUploadRequestSchema のテスト
   *
   * 動画アップロード時のリクエストバリデーションを検証します。
   * - ファイル形式 (MP4, MOV, WebM) のチェック
   * - ファイルサイズ (100MB以下) のチェック
   */
  describe('VideoUploadRequestSchema', () => {
    /**
     * 有効な動画ファイル (MP4) がバリデーションを通過することを確認
     */
    it('有効な MP4 ファイルを受け入れること', () => {
      const file = new File(['dummy content'], 'test.mp4', { type: 'video/mp4' });
      const result = VideoUploadRequestSchema.safeParse({ file });
      expect(result.success).toBe(true);
    });

    /**
     * 無効なファイル形式 (テキストファイル) を拒否することを確認
     */
    it('無効なファイル形式を拒否すること', () => {
      const file = new File(['dummy'], 'test.txt', { type: 'text/plain' });
      const result = VideoUploadRequestSchema.safeParse({ file });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain('対応していないファイル形式');
      }
    });
  });

  /**
   * VideoProcessResponseSchema のテスト
   *
   * バックエンドからの処理完了レスポンスのバリデーションを検証します。
   * OpenAPI 仕様 (pose-est-backend/docs/openapi.yaml) に準拠した形式を期待します。
   */
  describe('VideoProcessResponseSchema', () => {
    /**
     * 有効なレスポンスデータをパースできることを確認
     */
    it('有効なレスポンスデータを受け入れること', () => {
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
      expect(result.success).toBe(true);
    });

    /**
     * 無効な URL 形式を拒否することを確認
     */
    it('無効な URL 形式を拒否すること', () => {
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

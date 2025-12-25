import { z } from 'zod';

/**
 * 汎用的なAPIエラーレスポンスのスキーマ
 */
export const ApiErrorSchema = z.object({
    error: z.string(),
    details: z.unknown().optional(),
    code: z.string().optional(),
});
export type ApiError = z.infer<typeof ApiErrorSchema>;

/**
 * 動画アップロードリクエストのスキーマ
 * 実際のリクエストはFormDataだが、ここではバリデーション用のスキーマを定義
 */
export const VideoUploadRequestSchema = z.object({
    video: z
        .custom<File>((file) => file instanceof File, 'ファイルが必要です')
        .refine((file) => file.size <= 100 * 1024 * 1024, 'ファイルサイズは100MB以下にしてください')
        .refine(
            (file) => ['video/mp4', 'video/quicktime', 'video/webm'].includes(file.type),
            '対応していないファイル形式です (mp4, mov, webmのみ)'
        ),
});
export type VideoUploadRequest = z.infer<typeof VideoUploadRequestSchema>;

/**
 * 動画処理完了等のレスポンススキーマ
 */
export const VideoProcessResponseSchema = z.object({
    processedVideoUrl: z.string().url(),
    processingTimeMs: z.number().optional(),
    metadata: z.record(z.unknown()).optional(),
});
export type VideoProcessResponse = z.infer<typeof VideoProcessResponseSchema>;

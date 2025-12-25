import { z } from 'zod';

/**
 * 動画処理のステータス
 */
export const ProcessingStatusSchema = z.enum([
    'IDLE',
    'UPLOADING',
    'PROCESSING',
    'COMPLETED',
    'ERROR',
]);
export type ProcessingStatus = z.infer<typeof ProcessingStatusSchema>;

/**
 * 動画メタデータ
 */
export const VideoMetadataSchema = z.object({
    filename: z.string(),
    filesize: z.number(),
    duration: z.number().optional(),
    dimensions: z
        .object({
            width: z.number(),
            height: z.number(),
        })
        .optional(),
    type: z.string(),
});
export type VideoMetadata = z.infer<typeof VideoMetadataSchema>;

/**
 * 処理セッションの状態
 */
export const ProcessingSessionSchema = z.object({
    id: z.string().uuid(),
    status: ProcessingStatusSchema,
    originalVideoUrl: z.string().optional(),
    processedVideoUrl: z.string().optional(),
    error: z.string().optional(),
    progress: z.number().min(0).max(100).default(0),
    createdAt: z.date(),
    updatedAt: z.date(),
});
export type ProcessingSession = z.infer<typeof ProcessingSessionSchema>;

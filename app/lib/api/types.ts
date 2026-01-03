/**
 * @fileoverview API通信で使用する型定義とZodバリデーションスキーマ
 *
 * このファイルでは、バックエンドAPIとの通信に使用するリクエスト/レスポンスの
 * 型定義をZodスキーマとして定義しています。Zodを使用することで、
 * ランタイムでの型検証とTypeScriptの型推論を同時に実現しています。
 */

import { z } from 'zod';

/**
 * 汎用的なAPIエラーレスポンスのスキーマ
 *
 * バックエンドAPIから返却されるエラーレスポンスの共通フォーマットです。
 * エラー詳細は `error` オブジェクト内にネストされています。
 *
 * @example
 * ```json
 * {
 *   "error": {
 *     "code": "FILE_TOO_LARGE",
 *     "message": "File size exceeds limit"
 *   }
 * }
 * ```
 */
export const ApiErrorSchema = z.object({
    error: z.object({
        /** エラーコード（プログラムでのハンドリング用） */
        code: z.string(),
        /** エラーメッセージ（ユーザーに表示可能） */
        message: z.string(),
        /** エラーの詳細情報（デバッグ用、オプション） */
        details: z.unknown().optional(),
    }),
});

/** APIエラーレスポンスの型 */
export type ApiError = z.infer<typeof ApiErrorSchema>;

/**
 * 動画アップロードリクエストのバリデーションスキーマ
 *
 * ユーザーがアップロードする動画ファイルのバリデーションルール:
 * - ファイルサイズ: 100MB以下
 * - ファイル形式: MP4, MOV, WebM のみ
 */
export const VideoUploadRequestSchema = z.object({
    /** アップロードする動画ファイル */
    file: z
        .custom<File>((file) => {
            // JSDOM/Node環境でのFileオブジェクトの判定が不安定なため、
            // ダックタイピングで最低限のプロパティ存在確認を行う
            return (
                file instanceof File || 
                (typeof file === 'object' && file !== null && 'name' in file && 'size' in file && 'type' in file)
            );
        }, 'ファイルが必要です')
        .refine(
            (file) => file.size <= 100 * 1024 * 1024,
            'ファイルサイズは100MB以下にしてください'
        )
        .refine(
            (file) => ['video/mp4', 'video/quicktime', 'video/webm'].includes(file.type),
            '対応していないファイル形式です (mp4, mov, webmのみ)'
        ),
    /** 姿勢検出の閾値 (0.0-1.0) */
    score_threshold: z.number().min(0.0).max(1.0).default(0.2).optional(),
});

/** 動画アップロードリクエストの型 */
export type VideoUploadRequest = z.infer<typeof VideoUploadRequestSchema>;

/**
 * 動画メタデータのスキーマ
 */
export const VideoMetaResponseSchema = z.object({
    width: z.number().int(),
    height: z.number().int(),
    fps: z.number(),
    duration_sec: z.number(),
    has_audio: z.boolean(),
});

/** 動画メタデータの型 */
export type VideoMetaResponse = z.infer<typeof VideoMetaResponseSchema>;

/**
 * 動画処理完了レスポンスのスキーマ
 *
 * バックエンドでの姿勢推定処理が完了した際に返却されるレスポンスです。
 */
export const VideoProcessResponseSchema = z.object({
    /** 処理済み動画の署名付き URL */
    signed_url: z.string().url(),
    /** 動画メタデータ */
    video_meta: VideoMetaResponseSchema,
    /** 検出された延べ姿勢数 */
    total_poses: z.number().int(),
    /** 処理にかかった時間（秒） */
    processing_time_sec: z.number(),
});

/** 動画処理レスポンスの型 */
export type VideoProcessResponse = z.infer<typeof VideoProcessResponseSchema>;

/**
 * ヘルスチェックレスポンスのスキーマ
 */
export const HealthResponseSchema = z.object({
    status: z.string(),
    version: z.string(),
});

/** ヘルスチェックレスポンスの型 */
export type HealthResponse = z.infer<typeof HealthResponseSchema>;

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
 *
 * @example
 * ```typescript
 * const errorResponse = ApiErrorSchema.parse({
 *   error: 'ファイルが見つかりません',
 *   code: 'FILE_NOT_FOUND'
 * });
 * ```
 */
export const ApiErrorSchema = z.object({
    /** エラーメッセージ（ユーザーに表示可能） */
    error: z.string(),
    /** エラーの詳細情報（デバッグ用、オプション） */
    details: z.unknown().optional(),
    /** エラーコード（プログラムでのハンドリング用、オプション） */
    code: z.string().optional(),
});

/** APIエラーレスポンスの型 */
export type ApiError = z.infer<typeof ApiErrorSchema>;

/**
 * 動画アップロードリクエストのバリデーションスキーマ
 *
 * ユーザーがアップロードする動画ファイルのバリデーションルール:
 * - ファイルサイズ: 100MB以下
 * - ファイル形式: MP4, MOV, WebM のみ
 *
 * @remarks
 * 実際のHTTPリクエストはFormData形式で送信されますが、
 * このスキーマはクライアント側でのバリデーションに使用します。
 *
 * @example
 * ```typescript
 * const file = event.target.files[0];
 * const result = VideoUploadRequestSchema.safeParse({ video: file });
 * if (!result.success) {
 *   showError(result.error.errors[0].message);
 * }
 * ```
 */
export const VideoUploadRequestSchema = z.object({
    /** アップロードする動画ファイル */
    video: z
        .custom<File>((file) => file instanceof File, 'ファイルが必要です')
        .refine(
            (file) => file.size <= 100 * 1024 * 1024,
            'ファイルサイズは100MB以下にしてください'
        )
        .refine(
            (file) => ['video/mp4', 'video/quicktime', 'video/webm'].includes(file.type),
            '対応していないファイル形式です (mp4, mov, webmのみ)'
        ),
});

/** 動画アップロードリクエストの型 */
export type VideoUploadRequest = z.infer<typeof VideoUploadRequestSchema>;

/**
 * 動画処理完了レスポンスのスキーマ
 *
 * バックエンドでの姿勢推定処理が完了した際に返却されるレスポンスです。
 *
 * @example
 * ```typescript
 * const response = await fetch('/api/process-video');
 * const data = VideoProcessResponseSchema.parse(await response.json());
 * videoPlayer.src = data.processedVideoUrl;
 * ```
 */
export const VideoProcessResponseSchema = z.object({
    /** 処理済み動画のURL（ブラウザで再生可能） */
    processedVideoUrl: z.string().url(),
    /** 処理にかかった時間（ミリ秒、オプション） */
    processingTimeMs: z.number().optional(),
    /** その他のメタデータ（解析結果など、オプション） */
    metadata: z.record(z.unknown()).optional(),
});

/** 動画処理レスポンスの型 */
export type VideoProcessResponse = z.infer<typeof VideoProcessResponseSchema>;

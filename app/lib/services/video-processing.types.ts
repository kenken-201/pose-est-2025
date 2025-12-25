/**
 * @fileoverview 動画処理サービス層で使用する型定義とZodスキーマ
 *
 * このファイルでは、動画処理のビジネスロジック層で使用する
 * ドメインモデルの型定義を提供します。
 */

import { z } from 'zod';

/**
 * 動画処理のステータスを表すEnum型スキーマ
 *
 * 処理の各段階を表現し、UIでの状態表示に使用します。
 *
 * - `IDLE`: 初期状態、何も処理していない
 * - `UPLOADING`: 動画をサーバーにアップロード中
 * - `PROCESSING`: サーバー側で姿勢推定処理を実行中
 * - `COMPLETED`: 処理が正常に完了
 * - `ERROR`: エラーが発生して処理が中断
 */
export const ProcessingStatusSchema = z.enum([
    'IDLE',
    'UPLOADING',
    'PROCESSING',
    'COMPLETED',
    'ERROR',
]);

/** 動画処理ステータスの型 */
export type ProcessingStatus = z.infer<typeof ProcessingStatusSchema>;

/**
 * 動画ファイルのメタデータスキーマ
 *
 * アップロードされた動画ファイルの基本情報を保持します。
 *
 * @example
 * ```typescript
 * const metadata: VideoMetadata = {
 *   filename: 'swing.mp4',
 *   filesize: 15728640,
 *   duration: 30.5,
 *   dimensions: { width: 1920, height: 1080 },
 *   type: 'video/mp4'
 * };
 * ```
 */
export const VideoMetadataSchema = z.object({
    /** ファイル名（拡張子含む） */
    filename: z.string(),
    /** ファイルサイズ（バイト） */
    filesize: z.number(),
    /** 動画の長さ（秒、取得できない場合はundefined） */
    duration: z.number().optional(),
    /** 動画の解像度（取得できない場合はundefined） */
    dimensions: z
        .object({
            /** 横幅（ピクセル） */
            width: z.number(),
            /** 高さ（ピクセル） */
            height: z.number(),
        })
        .optional(),
    /** MIMEタイプ（例: 'video/mp4'） */
    type: z.string(),
});

/** 動画メタデータの型 */
export type VideoMetadata = z.infer<typeof VideoMetadataSchema>;

/**
 * 動画処理セッションの状態スキーマ
 *
 * 1回の動画処理リクエストのライフサイクル全体を追跡するためのオブジェクトです。
 * Zustandストアなどで状態管理に使用します。
 *
 * @example
 * ```typescript
 * const session: ProcessingSession = {
 *   id: '550e8400-e29b-41d4-a716-446655440000',
 *   status: 'PROCESSING',
 *   progress: 45,
 *   createdAt: new Date(),
 *   updatedAt: new Date()
 * };
 * ```
 */
export const ProcessingSessionSchema = z.object({
    /** セッションの一意識別子（UUID v4） */
    id: z.string().uuid(),
    /** 現在の処理ステータス */
    status: ProcessingStatusSchema,
    /** 元動画のURL（アップロード後に設定、オプション） */
    originalVideoUrl: z.string().optional(),
    /** 処理済み動画のURL（処理完了後に設定、オプション） */
    processedVideoUrl: z.string().optional(),
    /** エラーメッセージ（エラー発生時のみ設定） */
    error: z.string().optional(),
    /** 処理の進捗率（0-100%） */
    progress: z.number().min(0).max(100).default(0),
    /** セッション作成日時 */
    createdAt: z.date(),
    /** セッション更新日時 */
    updatedAt: z.date(),
});

/** 動画処理セッションの型 */
export type ProcessingSession = z.infer<typeof ProcessingSessionSchema>;

import { AxiosError } from 'axios';
import { ApiErrorSchema } from './types';

/**
 * アプリケーション独自のAPIエラークラス
 *
 * AxiosのエラーをWrapし、統一された形式でエラーハンドリング可能にします。
 */
export class AppAPIError extends Error {
    public readonly code: string;
    public readonly status: number;
    public readonly data?: unknown;

    constructor(message: string, code: string, status: number, data?: unknown) {
        super(message);
        this.name = 'AppAPIError';
        this.code = code;
        this.status = status;
        this.data = data;
        // TypeScript ES5ターゲット時のinstanceof互換性のため
        Object.setPrototypeOf(this, AppAPIError.prototype);
    }
}

/**
 * AppAPIErrorのタイプガード
 */
export const isAppAPIError = (error: unknown): error is AppAPIError => {
    return error instanceof AppAPIError;
};

/**
 * AxiosErrorからAppAPIErrorを生成するファクトリー関数
 *
 * - レスポンスボディが構造化されたエラー（ApiErrorSchema）の場合はそれを優先
 * - Network ErrorやTimeoutなども専用コードに変換
 */
export const createErrorFromAxiosError = (error: AxiosError): AppAPIError => {
    if (error.response) {
        // サーバーからのレスポンスがある場合
        const data = error.response.data;
        const status = error.response.status;

        // レスポンスが既定のエラー形式かチェック
        const parseResult = ApiErrorSchema.safeParse(data);
        if (parseResult.success) {
            return new AppAPIError(
                parseResult.data.error, // message is in 'error' field
                parseResult.data.code || 'API_ERROR',
                status,
                parseResult.data.details
            );
        }

        // 定義されていない形式のエラーレスポンス
        return new AppAPIError(
            error.message,
            'UNKNOWN_ERROR',
            status,
            data
        );
    } else if (error.request) {
        // リクエストは送信されたがレスポンスがない場合（ネットワークエラーやタイムアウト）
        
        // Axiosのタイムアウトコードチェック
        if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
            return new AppAPIError('Request timeout', 'TIMEOUT_ERROR', 408);
        }

        // ネットワークエラー
        return new AppAPIError('Network error', 'NETWORK_ERROR', 0);
    } else {
        // リクエスト設定時のエラーなど
        return new AppAPIError(error.message, 'CLIENT_ERROR', 400);
    }
};

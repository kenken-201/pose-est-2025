import { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { logger } from '../utils/logger';

/**
 * リクエストインターセプター
 * 
 * 送信前のリクエストをログ出力します。
 * 必要な場合は認証トークンの付与などもここで行います。
 */
export const handleRequest = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    logger.debug(`Before API Request: ${config.method?.toUpperCase()} ${config.url}`, {
        headers: config.headers,
        params: config.params,
    });
    return config;
};

/**
 * レスポンスインターセプター（成功時）
 * 
 * 成功したレスポンスをログ出力します。
 */
export const handleResponse = (response: AxiosResponse): AxiosResponse => {
    logger.debug(`API Response: ${response.status} ${response.config.url}`, {
        data: response.data,
    });
    return response;
};

/**
 * レスポンスインターセプター（エラー時）
 * 
 * APIエラーをログ出力し、呼び出し元に伝播させます。
 * 共通のエラーハンドリングが必要な場合はここに記述します。
 */
export const handleError = (error: AxiosError): Promise<never> => {
    logger.error(`API Error: ${error.message}`, {
        url: error.config?.url,
        status: error.response?.status,
        data: error.response?.data,
    });
    return Promise.reject(error);
};

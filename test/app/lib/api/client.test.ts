import { describe, it, expect, vi } from 'vitest';
import { APP_CONFIG } from '@/lib/config/constants';

// ホイスティングの問題を回避するためにモックファクトリーをインラインで定義
const mocks = vi.hoisted(() => ({
    create: vi.fn(() => ({
        interceptors: {
            request: { use: vi.fn(), eject: vi.fn() },
            response: { use: vi.fn(), eject: vi.fn() },
        },
        defaults: { headers: { common: {} } },
        get: vi.fn(),
        post: vi.fn(),
    })),
}));

vi.mock('axios', () => ({
    default: {
        create: mocks.create,
    },
}));

import { apiClient } from '@/lib/api/client';

/**
 * APIクライアントのユニットテスト
 * 
 * アプリケーション全体で使用されるAxiosインスタンスが
 * 適切な設定（Base URL, Timeoutなど）で初期化されているかを検証します。
 */
describe('API Client', () => {
    /**
     * 初期化設定のテスト
     * 
     * 環境変数（APP_CONFIG）から正しい値が読み込まれ、
     * Axiosのcreateメソッドに渡されているかを確認します。
     */
    it('should be created with correct configuration', () => {
        expect(mocks.create).toHaveBeenCalledWith({
            baseURL: APP_CONFIG.API.BASE_URL,
            timeout: APP_CONFIG.API.TIMEOUT_MS,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    });

    /**
     * シングルトンインスタンスの存在確認
     */
    it('should exist as a singleton instance', () => {
        expect(apiClient).toBeDefined();
    });
});

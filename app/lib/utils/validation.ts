import { z } from 'zod';

/**
 * メールアドレスの簡易バリデーション
 */
export const isValidEmail = (email: string): boolean => {
    return z.string().email().safeParse(email).success;
};

/**
 * UUIDのバリデーション
 */
export const isValidUUID = (id: string): boolean => {
    return z.string().uuid().safeParse(id).success;
};

/**
 * URLのバリデーション
 */
export const isValidUrl = (url: string): boolean => {
    return z.string().url().safeParse(url).success;
};

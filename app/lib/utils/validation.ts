/**
 * @fileoverview 汎用バリデーションユーティリティ関数
 *
 * Zodを使用した一般的な値のバリデーション関数を提供します。
 * これらの関数は真偽値を返すため、条件分岐で直接使用できます。
 */

import { z } from 'zod';

/**
 * メールアドレスの形式をバリデーションする
 *
 * RFC 5322に準拠したメールアドレス形式かどうかをチェックします。
 *
 * @param email - バリデーション対象のメールアドレス文字列
 * @returns 有効なメールアドレス形式の場合はtrue、それ以外はfalse
 *
 * @example
 * ```typescript
 * isValidEmail('user@example.com');  // true
 * isValidEmail('invalid-email');     // false
 * isValidEmail('user@');             // false
 * ```
 */
export const isValidEmail = (email: string): boolean => {
  return z.string().email().safeParse(email).success;
};

/**
 * UUID v4形式をバリデーションする
 *
 * 文字列がUUID v4形式（8-4-4-4-12のハイフン区切り16進数）かどうかをチェックします。
 *
 * @param id - バリデーション対象のUUID文字列
 * @returns 有効なUUID形式の場合はtrue、それ以外はfalse
 *
 * @example
 * ```typescript
 * isValidUUID('550e8400-e29b-41d4-a716-446655440000');  // true
 * isValidUUID('not-a-uuid');                            // false
 * isValidUUID('550e8400e29b41d4a716446655440000');      // false (ハイフンなし)
 * ```
 */
export const isValidUUID = (id: string): boolean => {
  return z.string().uuid().safeParse(id).success;
};

/**
 * URL形式をバリデーションする
 *
 * 文字列が有効なURL形式（http://またはhttps://で始まる）かどうかをチェックします。
 *
 * @param url - バリデーション対象のURL文字列
 * @returns 有効なURL形式の場合はtrue、それ以外はfalse
 *
 * @example
 * ```typescript
 * isValidUrl('https://example.com/path?query=1');  // true
 * isValidUrl('http://localhost:3000');             // true
 * isValidUrl('not-a-url');                         // false
 * isValidUrl('ftp://files.example.com');           // true
 * ```
 */
export const isValidUrl = (url: string): boolean => {
  return z.string().url().safeParse(url).success;
};

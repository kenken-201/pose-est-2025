/**
 * @fileoverview Cloudflare Pages互換の軽量ロガー
 *
 * Cloudflare Pages（Edge Runtime）で動作する軽量なロギングユーティリティです。
 * winston等のNode.js依存ライブラリはEdge環境で動作しないため、
 * console APIをラップしたカスタム実装を使用しています。
 *
 * @remarks
 * - 開発環境ではdebugレベルから出力
 * - 本番環境ではinfoレベルから出力
 * - 各レベルには統一されたプレフィックスが付与される
 */

/** ログレベルの型定義（低い方がより詳細） */
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * ロガークラス
 *
 * シングルトンとしてエクスポートされ、アプリケーション全体で
 * 統一されたログ出力を提供します。
 *
 * @example
 * ```typescript
 * import { logger } from './logger';
 *
 * logger.debug('デバッグ情報', { userId: 123 });
 * logger.info('処理を開始します');
 * logger.warn('警告: レート制限に近づいています');
 * logger.error('エラーが発生しました', error);
 * ```
 */

export class Logger {
    /** 現在のログレベル（これ以上のレベルのみ出力） */
    private level: LogLevel = 'info';

    /**
     * ロガーのコンストラクタ
     *
     * 環境変数NODE_ENVが'development'の場合はdebugレベルに設定します。
     * Cloudflare Pages等のEdge環境ではprocess.envが存在しない場合があるため、
     * 存在チェックを行っています。
     */
    constructor() {
        // Edge環境でもprocess.envが存在しない場合を考慮
        if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
            this.level = 'debug';
        }
    }

    /**
     * 指定されたログレベルが現在の設定で出力されるべきか判定する
     *
     * @param targetLevel - 判定対象のログレベル
     * @returns 出力すべき場合はtrue
     */
    private shouldLog(targetLevel: LogLevel): boolean {
        const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
        return levels.indexOf(targetLevel) >= levels.indexOf(this.level);
    }

    /**
     * デバッグレベルのログを出力する
     *
     * 開発時のデバッグ情報に使用します。本番環境では出力されません。
     *
     * @param message - ログメッセージ
     * @param args - 追加の引数（オブジェクト、配列など）
     */
    debug(message: string, ...args: unknown[]): void {
        if (this.shouldLog('debug')) {
            console.debug(`[DEBUG] ${message}`, ...args);
        }
    }

    /**
     * 情報レベルのログを出力する
     *
     * 通常の処理フローの記録に使用します。
     *
     * @param message - ログメッセージ
     * @param args - 追加の引数
     */
    info(message: string, ...args: unknown[]): void {
        if (this.shouldLog('info')) {
            console.info(`[INFO] ${message}`, ...args);
        }
    }

    /**
     * 警告レベルのログを出力する
     *
     * 問題の可能性があるが処理は継続できる状況で使用します。
     *
     * @param message - ログメッセージ
     * @param args - 追加の引数
     */
    warn(message: string, ...args: unknown[]): void {
        if (this.shouldLog('warn')) {
            console.warn(`[WARN] ${message}`, ...args);
        }
    }

    /**
     * エラーレベルのログを出力する
     *
     * エラーが発生した場合に使用します。必ず出力されます。
     *
     * @param message - ログメッセージ
     * @param args - 追加の引数（Errorオブジェクトなど）
     */
    error(message: string, ...args: unknown[]): void {
        if (this.shouldLog('error')) {
            console.error(`[ERROR] ${message}`, ...args);
        }
    }
}

/** アプリケーション全体で使用するロガーインスタンス */
export const logger = new Logger();

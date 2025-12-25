type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
    private level: LogLevel = 'info';

    constructor() {
        // 環境変数や設定からログレベルを読み込む余地を残す
        if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
            this.level = 'debug';
        }
    }

    private shouldLog(targetLevel: LogLevel): boolean {
        const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
        return levels.indexOf(targetLevel) >= levels.indexOf(this.level);
    }

    debug(message: string, ...args: unknown[]) {
        if (this.shouldLog('debug')) {
            console.debug(`[DEBUG] ${message}`, ...args);
        }
    }

    info(message: string, ...args: unknown[]) {
        if (this.shouldLog('info')) {
            console.info(`[INFO] ${message}`, ...args);
        }
    }

    warn(message: string, ...args: unknown[]) {
        if (this.shouldLog('warn')) {
            console.warn(`[WARN] ${message}`, ...args);
        }
    }

    error(message: string, ...args: unknown[]) {
        if (this.shouldLog('error')) {
            console.error(`[ERROR] ${message}`, ...args);
        }
    }
}

export const logger = new Logger();

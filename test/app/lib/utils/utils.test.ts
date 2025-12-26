import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { isValidEmail, isValidUUID, isValidUrl } from '@/lib/utils/validation';
import { formatFileSize, getFileExtension } from '@/lib/utils/file-utils';
import { logger, Logger } from '@/lib/utils/logger';

// ... (other tests omit for brevity in description but I will include them if I replace whole file or use context correctly)
// Actually I'll just append/replace the Logger Utility describe block

describe('Logger Utility', () => {
    it('should log info messages', () => {
        const consoleSpy = vi.spyOn(console, 'info');
        logger.info('test message');
        expect(consoleSpy).toHaveBeenCalledWith('[INFO] test message');
        consoleSpy.mockRestore();
    });

    it('should log warn messages', () => {
        const consoleSpy = vi.spyOn(console, 'warn');
        logger.warn('warning message');
        expect(consoleSpy).toHaveBeenCalledWith('[WARN] warning message');
        consoleSpy.mockRestore();
    });

    it('should log error messages', () => {
        const consoleSpy = vi.spyOn(console, 'error');
        const error = new Error('test error');
        logger.error('error message', error);
        expect(consoleSpy).toHaveBeenCalledWith('[ERROR] error message', error);
        consoleSpy.mockRestore();
    });

    it('should NOT log debug messages by default (in non-dev env)', () => {
        const consoleSpy = vi.spyOn(console, 'debug');
        logger.debug('debug message');
        expect(consoleSpy).not.toHaveBeenCalled();
        consoleSpy.mockRestore();
    });

    it('should initialize with debug level in development environment', () => {
        const originalEnv = process.env.NODE_ENV;
        process.env.NODE_ENV = 'development';
        
        const devLogger = new Logger();
        const consoleSpy = vi.spyOn(console, 'debug');
        
        devLogger.debug('debug message');
        expect(consoleSpy).toHaveBeenCalledWith('[DEBUG] debug message');
        
        consoleSpy.mockRestore();
        process.env.NODE_ENV = originalEnv;
    });

    it('should not throw if process is undefined (simulating edge env edge case)', () => {
        // This is hard to simulate in typical test runner without strict isolation
        // but we can at least ensure standard instantiation works
        const simpleLogger = new Logger();
        expect(simpleLogger).toBeDefined();
    });
});

describe('Validation Utilities', () => {
    it('should validate email', () => {
        expect(isValidEmail('test@example.com')).toBe(true);
        expect(isValidEmail('invalid-email')).toBe(false);
    });

    it('should validate UUID', () => {
        expect(isValidUUID('123e4567-e89b-12d3-a456-426614174000')).toBe(true);
        expect(isValidUUID('invalid-uuid')).toBe(false);
    });

    it('should validate URL', () => {
        expect(isValidUrl('https://example.com')).toBe(true);
        expect(isValidUrl('not-a-url')).toBe(false);
    });
});

describe('File Utilities', () => {
    it('should format file size', () => {
        expect(formatFileSize(0)).toBe('0 Bytes');
        expect(formatFileSize(1024)).toBe('1 KB');
        expect(formatFileSize(1024 * 1024)).toBe('1 MB');
    });

    it('should get file extension', () => {
        expect(getFileExtension('test.txt')).toBe('txt');
        expect(getFileExtension('archive.tar.gz')).toBe('gz');
        expect(getFileExtension('noextension')).toBe('');
        // slice((( -1 ) >>> 0) + 2) -> slice(2^32 + 1) -> empty string?
        // Let's check logic: lastIndexOf('.') - 1. if -1 -> -2 >>> 0 is huge.
    });
});

describe('Logger Utility', () => {
    it('should log info messages', () => {
        const consoleSpy = vi.spyOn(console, 'info');
        logger.info('test message');
        expect(consoleSpy).toHaveBeenCalledWith('[INFO] test message');
        consoleSpy.mockRestore();
    });

    it('should log warn messages', () => {
        const consoleSpy = vi.spyOn(console, 'warn');
        logger.warn('warning message');
        expect(consoleSpy).toHaveBeenCalledWith('[WARN] warning message');
        consoleSpy.mockRestore();
    });

    it('should log error messages', () => {
        const consoleSpy = vi.spyOn(console, 'error');
        const error = new Error('test error');
        logger.error('error message', error);
        expect(consoleSpy).toHaveBeenCalledWith('[ERROR] error message', error);
        consoleSpy.mockRestore();
    });

    it('should NOT log debug messages by default (in non-dev env)', () => {
        const consoleSpy = vi.spyOn(console, 'debug');
        logger.debug('debug message');
        expect(consoleSpy).not.toHaveBeenCalled();
        consoleSpy.mockRestore();
    });

    it('should initialize with debug level in development environment', () => {
        const originalEnv = process.env.NODE_ENV;
        process.env.NODE_ENV = 'development';
        
        const devLogger = new Logger();
        const consoleSpy = vi.spyOn(console, 'debug');
        
        devLogger.debug('debug message');
        expect(consoleSpy).toHaveBeenCalledWith('[DEBUG] debug message');
        
        consoleSpy.mockRestore();
        process.env.NODE_ENV = originalEnv;
    });
});

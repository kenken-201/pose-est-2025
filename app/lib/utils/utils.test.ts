import { describe, it, expect, vi } from 'vitest';
import { isValidEmail, isValidUUID, isValidUrl } from './validation';
import { formatFileSize, getFileExtension } from './file-utils';
import { logger } from './logger';

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
    it('should log messages without erroring', () => {
        const consoleSpy = vi.spyOn(console, 'info');
        logger.info('test message');
        expect(consoleSpy).toHaveBeenCalledWith('[INFO] test message');
        consoleSpy.mockRestore();
    });
});

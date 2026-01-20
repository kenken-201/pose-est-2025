import { describe, it, expect, vi } from 'vitest';
import { showSuccess, showError, showInfo } from '@/lib/utils/toast';
import { toast } from 'sonner';

// Mock sonner
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

describe('Toast Utilities', () => {
  it('showSuccess should call toast.success with options', () => {
    const message = 'Success message';
    const options = { duration: 5000 };
    showSuccess(message, options);
    expect(toast.success).toHaveBeenCalledWith(message, options);
  });

  it('showError should call toast.error with options', () => {
    const message = 'Error message';
    const options = { duration: 3000 };
    showError(message, options);
    expect(toast.error).toHaveBeenCalledWith(message, options);
  });

  it('showInfo should call toast.info with options', () => {
    const message = 'Info message';
    const options = { id: 'info-toast' };
    showInfo(message, options);
    expect(toast.info).toHaveBeenCalledWith(message, options);
  });
});

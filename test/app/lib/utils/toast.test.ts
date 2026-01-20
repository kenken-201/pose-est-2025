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
  it('showSuccess should call toast.success', () => {
    const message = 'Success message';
    showSuccess(message);
    expect(toast.success).toHaveBeenCalledWith(message);
  });

  it('showError should call toast.error', () => {
    const message = 'Error message';
    showError(message);
    expect(toast.error).toHaveBeenCalledWith(message);
  });

  it('showInfo should call toast.info', () => {
    const message = 'Info message';
    showInfo(message);
    expect(toast.info).toHaveBeenCalledWith(message);
  });
});

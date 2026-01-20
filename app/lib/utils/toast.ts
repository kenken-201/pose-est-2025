import { toast, type ExternalToast } from 'sonner';

/**
 * Toast Notification Utilities
 *
 * Wraps the toast library (sonner) to provide consistent success/error notifications.
 */

/**
 * Shows a success toast notification.
 * @param message - The message to display
 * @param options - Optional toast configuration (e.g., duration, description)
 */
export const showSuccess = (message: string, options?: ExternalToast) => {
  toast.success(message, options);
};

/**
 * Shows an error toast notification.
 * @param message - The message to display
 * @param options - Optional toast configuration
 */
export const showError = (message: string, options?: ExternalToast) => {
  toast.error(message, options);
};

/**
 * Shows an informational toast notification.
 * @param message - The message to display
 * @param options - Optional toast configuration
 */
export const showInfo = (message: string, options?: ExternalToast) => {
  toast.info(message, options);
};

/**
 * Dismisses a specific toast or all toasts.
 * @param toastId - The ID of the toast to dismiss (optional)
 */
export const dismissToast = (toastId?: string | number) => {
  toast.dismiss(toastId);
};

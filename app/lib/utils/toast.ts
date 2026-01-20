import { toast } from 'sonner';

/**
 * Toast Notification Utilities
 *
 * Wraps the toast library (sonner) to provide consistent success/error notifications.
 */

/**
 * Shows a success toast notification.
 * @param message - The message to display
 */
export const showSuccess = (message: string) => {
  toast.success(message);
};

/**
 * Shows an error toast notification.
 * @param message - The message to display
 */
export const showError = (message: string) => {
  toast.error(message);
};

/**
 * Shows an informational toast notification.
 * @param message - The message to display
 */
export const showInfo = (message: string) => {
  toast.info(message);
};

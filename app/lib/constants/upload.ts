/**
 * File upload constants
 *
 * Defines limits for file uploads to ensure compatibility with backend constraints.
 * Cloud Run has a 32MB request body limit, so we use 30MB as a safe threshold.
 *
 * @see https://cloud.google.com/run/quotas#request_limits
 */

/**
 * Maximum file size in bytes (30MB).
 * Used for validation in UploadDropzone component.
 */
export const MAX_FILE_SIZE_BYTES = 30 * 1024 * 1024;

/**
 * Human-readable display string for the file size limit.
 * Used in UI messages and error text.
 */
export const MAX_FILE_SIZE_DISPLAY = '30MB';

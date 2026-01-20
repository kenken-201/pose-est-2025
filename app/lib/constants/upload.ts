/**
 * File upload constants
 *
 * Defines limits for file uploads to ensure compatibility with backend constraints (e.g., Cloud Run).
 */

// 30MB limit to safely stay under Cloud Run's 32MB request body limit
export const MAX_FILE_SIZE_BYTES = 30 * 1024 * 1024;

// Display string for the file size limit
export const MAX_FILE_SIZE_DISPLAY = '30MB';

export const APP_CONFIG = {
    APP_NAME: 'KenKen Pose Est',
    API: {
        BASE_URL: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) || 'http://localhost:8000',
        TIMEOUT_MS: 30000,
        ENDPOINTS: {
            UPLOAD: '/process-video/',
            HEALTH: '/health',
        },
    },
    UPLOAD: {
        MAX_SIZE_BYTES: 100 * 1024 * 1024, // 100MB
        ACCEPTED_TYPES: {
            'video/mp4': ['.mp4'],
            'video/quicktime': ['.mov'],
            'video/webm': ['.webm'],
        },
    },
    UI: {
        TOAST_DURATION_MS: 5000,
    },
} as const;

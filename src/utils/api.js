// Centralized API configuration
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000").replace(/\/$/, "");

/**
 * Custom fetch wrapper that prepends API_BASE_URL if relative path is given
 * and automatically attaches credentials: 'include'
 */
export async function apiFetch(endpoint, options = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
    const defaultHeaders = {};

    const config = {
        credentials: 'include',
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };

    const response = await fetch(url, config);
    return response;
}

// Centralized API configuration
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000").replace(/\/$/, "");

export const getAuthToken = () => {
    try {
        return localStorage.getItem('auth_token');
    } catch (e) {
        return null;
    }
};

export const setAuthToken = (token) => {
    try {
        if (token) {
            localStorage.setItem('auth_token', token);
        } else {
            localStorage.removeItem('auth_token');
        }
    } catch (e) {}
};

export const removeAuthToken = () => {
    try {
        localStorage.removeItem('auth_token');
    } catch (e) {}
};

/**
 * Custom fetch wrapper that prepends API_BASE_URL if relative path is given
 * and automatically attaches credentials: 'include' & Authorization Bearer token
 */
export async function apiFetch(endpoint, options = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
    const defaultHeaders = {};

    const token = getAuthToken();
    if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

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


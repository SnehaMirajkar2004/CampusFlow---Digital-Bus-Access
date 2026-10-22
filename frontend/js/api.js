/**
 * Core API utility for CampusFlow
 * Requires utils.js to be loaded first
 */

const API_BASE_URL = 'http://127.0.0.1:5000/api';

/**
 * Reusable fetch wrapper that handles:
 * - JWT Authorization headers
 * - Token expiration checking
 * - Centralized error handling
 * - Automatic JSON parsing
 */
const apiFetch = async (endpoint, options = {}) => {
    // Check authentication and expiration
    const token = SessionStore.getToken();
    
    if (token) {
        if (isTokenExpired(token)) {
            SessionStore.clearSession();
            ErrorHandler.showError("Your session has expired. Please log in again.");
            // Redirect to login page
            window.location.href = 'login.html';
            throw new Error("Session expired");
        }
        
        // Setup headers if not exist
        options.headers = options.headers || {};
        options.headers['Authorization'] = `Bearer ${token}`;
    }

    // Default to JSON Content-Type if body is present and no Content-Type is set
    if (options.body && !(options.body instanceof FormData)) {
        options.headers = options.headers || {};
        if (!options.headers['Content-Type']) {
            options.headers['Content-Type'] = 'application/json';
        }
        // Ensure body is stringified if it's an object and Content-Type is JSON
        if (typeof options.body === 'object' && options.headers['Content-Type'] === 'application/json') {
            options.body = JSON.stringify(options.body);
        }
    }

    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

    try {
        const response = await fetch(url, options);
        let data;
        
        // Handle empty responses
        const text = await response.text();
        if (text) {
            try {
                data = JSON.parse(text);
            } catch (e) {
                data = { error: text };
            }
        } else {
            data = {};
        }

        if (!response.ok || (data && data.success === false)) {
            // Handle specific status codes
            if (response.status === 401) {
                SessionStore.clearSession();
                window.location.href = 'login.html';
            }

            // Extract error message
            let errorMessage = 'An unexpected error occurred.';
            if (data && data.error) {
                if (typeof data.error === 'string') {
                    errorMessage = data.error;
                } else if (typeof data.error === 'object') {
                    // Handle form validation errors (e.g. from Marshmallow)
                    const firstKey = Object.keys(data.error)[0];
                    if (Array.isArray(data.error[firstKey])) {
                        errorMessage = `${firstKey}: ${data.error[firstKey][0]}`;
                    } else {
                        errorMessage = `${firstKey}: ${data.error[firstKey]}`;
                    }
                }
            } else if (data && data.msg) {
                // Flask-JWT-Extended default error key is 'msg'
                errorMessage = data.msg;
            } else if (response.statusText) {
                errorMessage = response.statusText;
            }

            throw new Error(errorMessage);
        }

        return data;
    } catch (error) {
        // We log it here, but throw it to let the caller handle it or use ErrorHandler.showError
        console.error(`API Error on ${endpoint}:`, error);
        throw error;
    }
};

// --- HTTP Method Helpers ---
const api = {
    get: (endpoint, options = {}) => {
        return apiFetch(endpoint, { ...options, method: 'GET' });
    },
    
    post: (endpoint, body, options = {}) => {
        return apiFetch(endpoint, { ...options, method: 'POST', body });
    },
    
    put: (endpoint, body, options = {}) => {
        return apiFetch(endpoint, { ...options, method: 'PUT', body });
    },
    
    delete: (endpoint, options = {}) => {
        return apiFetch(endpoint, { ...options, method: 'DELETE' });
    }
};

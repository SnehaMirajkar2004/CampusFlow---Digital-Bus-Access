/**
 * Utility functions for CampusFlow
 */

// --- Session Persistence ---
const SessionStore = {
    setToken: (token) => localStorage.setItem('access_token', token),
    getToken: () => localStorage.getItem('access_token'),
    removeToken: () => localStorage.removeItem('access_token'),

    setUser: (userData) => {
        localStorage.setItem('user_data', JSON.stringify(userData));
        localStorage.setItem('user_role', userData.role);
    },
    getUser: () => {
        const data = localStorage.getItem('user_data');
        return data ? JSON.parse(data) : null;
    },
    getRole: () => localStorage.getItem('user_role'),
    removeUser: () => {
        localStorage.removeItem('user_data');
        localStorage.removeItem('user_role');
    },

    clearSession: () => {
        SessionStore.removeToken();
        SessionStore.removeUser();
    },

    isAuthenticated: () => !!SessionStore.getToken()
};

// --- Loading State Helpers ---
const Loader = {
    show: (elementId = null) => {
        if (elementId) {
            const el = document.getElementById(elementId);
            if (el) {
                el.dataset.originalText = el.innerHTML;
                el.innerHTML = '<span class="material-symbols-outlined animate-spin">progress_activity</span> Loading...';
                el.disabled = true;
                el.classList.add('opacity-75', 'cursor-not-allowed');
            }
        } else {
            // Global loader fallback (create if it doesn't exist)
            let globalLoader = document.getElementById('global-loader');
            if (!globalLoader) {
                globalLoader = document.createElement('div');
                globalLoader.id = 'global-loader';
                globalLoader.className = 'fixed inset-0 bg-surface/50 backdrop-blur-sm z-[9999] flex items-center justify-center';
                globalLoader.innerHTML = '<div class="glass-card p-6 rounded-2xl flex flex-col items-center gap-4 soft-shadow border border-white/50"><span class="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span><p class="font-label-sm text-on-surface">Please wait...</p></div>';
                document.body.appendChild(globalLoader);
            }
            globalLoader.classList.remove('hidden');
        }
    },
    hide: (elementId = null) => {
        if (elementId) {
            const el = document.getElementById(elementId);
            if (el && el.dataset.originalText) {
                el.innerHTML = el.dataset.originalText;
                el.disabled = false;
                el.classList.remove('opacity-75', 'cursor-not-allowed');
            }
        } else {
            const globalLoader = document.getElementById('global-loader');
            if (globalLoader) {
                globalLoader.classList.add('hidden');
            }
        }
    }
};

// --- Centralized Error Handling ---
const ErrorHandler = {
    showError: (message, containerId = 'error-message') => {
        console.error("CampusFlow Error:", message);
        const errorContainer = document.getElementById(containerId);
        if (errorContainer) {
            errorContainer.textContent = message;
            errorContainer.classList.remove('hidden');
            
            // Optional: Auto-hide after 5 seconds
            setTimeout(() => {
                errorContainer.classList.add('hidden');
            }, 5000);
        } else {
            alert(`Error: ${message}`);
        }
    },
    clearError: (containerId = 'error-message') => {
        const errorContainer = document.getElementById(containerId);
        if (errorContainer) {
            errorContainer.classList.add('hidden');
            errorContainer.textContent = '';
        }
    }
};

// --- JWT Expiration decoding (optional helper) ---
const decodeJWT = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
};

const isTokenExpired = (token) => {
    if (!token) return true;
    const decoded = decodeJWT(token);
    if (!decoded || !decoded.exp) return true;
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
};

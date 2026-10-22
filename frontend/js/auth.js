/**
 * Authentication logic utilizing the api.js and utils.js layers
 * Requires utils.js and api.js to be loaded first
 */

async function loginUser(email, password) {
    try {
        Loader.show(); // Show loading state
        
        const data = await api.post('/auth/login', { email, password });
        
        // Store token and user data using SessionStore
        SessionStore.setToken(data.data.access_token);
        SessionStore.setUser(data.data.user);
        
        // Redirect based on role
        if (data.data.user.role === 'admin') {
            window.location.href = 'admin_dashboard.html';
        } else {
            window.location.href = 'passenger_dashboard.html';
        }
    } catch (error) {
        ErrorHandler.showError(error.message);
    } finally {
        Loader.hide(); // Hide loading state
    }
}

async function registerUser(name, email, password, phone) {
    try {
        Loader.show(); // Show loading state
        
        await api.post('/auth/register', { name, email, password, phone });
        
        // Auto-login after registration or redirect to login
        alert('Registration successful! Please log in.');
        window.location.href = 'login.html';
    } catch (error) {
        ErrorHandler.showError(error.message);
    } finally {
        Loader.hide(); // Hide loading state
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            ErrorHandler.clearError();
            loginUser(email, password);
        });
    }

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm_password').value;
            const terms = document.getElementById('terms').checked;
            
            ErrorHandler.clearError();
            
            if (password !== confirmPassword) {
                ErrorHandler.showError('Passwords do not match');
                return;
            }
            
            if (!terms) {
                ErrorHandler.showError('You must agree to the Terms of Service');
                return;
            }
            
            registerUser(name, email, password, phone);
        });
    }
});

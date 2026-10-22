
async function fetchProfile() {
    try {
        const response = await api.get('/passenger/profile');
        if (response && response.success) {
            SessionStore.setUser(response.data);
            return response.data;
        }
    } catch (e) {
        console.error('Failed to fetch profile', e);
    }
    return null;
}

function updateCommonHeader(user) {
    if (!user) return;
    const nameEls = document.querySelectorAll('.user-name-display');
    nameEls.forEach(el => el.textContent = user.name || 'Student');
}

function initPassengerAuth() {
    if (!SessionStore.isAuthenticated()) {
        window.location.href = 'login.html';
        return false;
    }
    const logoutBtns = document.querySelectorAll('.logout-btn');
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            SessionStore.clearSession();
            window.location.href = 'login.html';
        });
    });
    return true;
}

async function initProfile() {
    Loader.show();
    const user = await fetchProfile() || SessionStore.getUser();
    updateCommonHeader(user);

    if (user) {
        const nameInput = document.getElementById('profile-name');
        const phoneInput = document.getElementById('profile-phone');
        const emailInput = document.getElementById('profile-email');
        
        if (nameInput) nameInput.value = user.name || '';
        if (phoneInput) phoneInput.value = user.phone || '';
        if (emailInput) emailInput.value = user.email || '';
    }
    Loader.hide();

    const form = document.getElementById('profile-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('profile-name').value;
            const phone = document.getElementById('profile-phone').value;
            
            try {
                Loader.show('profile-save-btn');
                const response = await api.put('/passenger/profile', { name, phone });
                if (response.success) {
                    SessionStore.setUser(response.data);
                    updateCommonHeader(response.data);
                    alert('Profile updated successfully!');
                }
            } catch (error) {
                ErrorHandler.showError(error.message, 'profile-error');
            } finally {
                Loader.hide('profile-save-btn');
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (initPassengerAuth()) initProfile();
});


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

async function initPassApplication() {
    Loader.show();
    const user = await fetchProfile() || SessionStore.getUser();
    updateCommonHeader(user);

    try {
        const response = await api.get('/routes');
        const select = document.getElementById('route-select');
        if (select && response.data) {
            select.innerHTML = '<option value="" disabled selected>Select a route</option>' + 
                response.data.map(route => `<option value="${route.id}">${route.name} (${route.start_point} to ${route.end_point})</option>`).join('');
        }
    } catch (e) {
        ErrorHandler.showError('Failed to load routes.', 'apply-error');
    } finally {
        Loader.hide();
    }

    const form = document.getElementById('apply-pass-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const routeId = document.getElementById('route-select').value;
            
            if (!routeId) {
                ErrorHandler.showError('Please select a route.', 'apply-error');
                return;
            }

            try {
                Loader.show();
                await api.post('/passenger/pass/apply', { route_id: parseInt(routeId) });
                alert('Pass application submitted successfully!');
                window.location.href = 'pass_status.html';
            } catch (error) {
                ErrorHandler.showError(error.message, 'apply-error');
            } finally {
                Loader.hide();
            }
        });
    }
}

async function initPassStatus() {
    Loader.show();
    const user = await fetchProfile() || SessionStore.getUser();
    updateCommonHeader(user);

    try {
        const response = await api.get('/passenger/pass/status');
        const container = document.getElementById('status-container');
        
        if (container) {
            const passes = response.data || [];
            if (passes.length === 0) {
                container.innerHTML = `<p class="p-4 text-center text-on-surface-variant">You have not applied for any passes yet.</p>`;
            } else {
                container.innerHTML = passes.map(p => {
                    const isApproved = p.status === 'approved';
                    const isRejected = p.status === 'rejected';
                    let icon = 'schedule';
                    let color = 'secondary';
                    let badge = 'bg-secondary/10 text-secondary';
                    
                    if (isApproved) { icon = 'check_circle'; color = 'primary'; badge = 'bg-primary/10 text-primary'; }
                    if (isRejected) { icon = 'cancel'; color = 'error'; badge = 'bg-error/10 text-error'; }

                    const dateStr = p.applied_at ? new Date(p.applied_at).toLocaleDateString() : 'N/A';

                    return `
                    <div class="glass-card p-6 rounded-2xl mb-4 flex items-center justify-between border-l-4 border-l-${color}">
                        <div class="flex items-center gap-4">
                            <div class="h-12 w-12 rounded-full bg-${color}/10 flex items-center justify-center">
                                <span class="material-symbols-outlined text-${color}">${icon}</span>
                            </div>
                            <div>
                                <h4 class="font-h3 text-h3 text-on-background">${p.route?.name || 'Route Pass'}</h4>
                                <p class="text-on-surface-variant text-sm">Applied on ${dateStr}</p>
                            </div>
                        </div>
                        <div class="text-right">
                            <span class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${badge}">${p.status}</span>
                            ${p.admin_note ? `<p class="text-xs text-on-surface-variant mt-2 max-w-xs">Note: ${p.admin_note}</p>` : ''}
                        </div>
                    </div>
                    `;
                }).join('');
            }
        }
    } catch (e) {
        console.error('Pass status error:', e);
    } finally {
        Loader.hide();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (initPassengerAuth()) {
        if (document.getElementById('apply-pass-form')) {
            initPassApplication();
        } else {
            initPassStatus();
        }
    }
});

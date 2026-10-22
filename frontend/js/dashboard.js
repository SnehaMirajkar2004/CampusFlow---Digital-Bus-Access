/**
 * Passenger Dashboard – CampusFlow
 * All data is fetched live from /api/passenger/dashboard (JWT-authenticated).
 * No hardcoded or demo values.
 */

// ─── Auth helpers ──────────────────────────────────────────────────
function initPassengerAuth() {
    if (!SessionStore.isAuthenticated()) {
        window.location.href = 'login.html';
        return false;
    }
    document.querySelectorAll('.logout-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            e.preventDefault();
            SessionStore.clearSession();
            window.location.href = 'login.html';
        });
    });
    return true;
}

// ─── Helpers ───────────────────────────────────────────────────────
function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

function setHTML(id, html) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
}

// ─── Active Pass widget ────────────────────────────────────────────
function renderActivePass(activePass) {
    const container = document.getElementById('active-pass-container');
    if (!container) return;

    if (activePass) {
        const routeName  = activePass.route?.name  || 'Assigned Route';
        const passId     = `PASS-${String(activePass.id).padStart(5, '0')}`;
        const appliedAt  = activePass.applied_at
            ? new Date(activePass.applied_at).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })
            : '—';
        const reviewedAt = activePass.reviewed_at
            ? new Date(activePass.reviewed_at).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })
            : null;

        container.innerHTML = `
            <div class="flex items-center gap-2 mb-4">
                <span class="flex h-3 w-3 rounded-full bg-primary animate-pulse"></span>
                <span class="font-label-sm text-label-sm text-primary font-bold uppercase tracking-wider">Active Pass</span>
            </div>
            <h3 class="font-h2 text-h2 text-on-background mb-1 tracking-tight">${routeName}</h3>
            <p class="font-body-md text-body-md text-on-surface-variant mb-1">Pass ID: <span class="font-semibold text-on-surface">${passId}</span></p>
            <p class="font-body-md text-body-md text-on-surface-variant mb-1">Approved: <span class="font-semibold text-on-surface">${reviewedAt || appliedAt}</span></p>
            <p class="font-body-md text-body-md text-on-surface-variant mb-6">Route: <span class="font-semibold text-on-surface">${activePass.route?.name || '—'}</span></p>
            <div class="flex gap-4">
                <button onclick="alert('Pass ID: ${passId}')" class="bg-gradient-to-r from-primary to-secondary text-on-primary font-label-sm text-label-sm px-6 py-3 rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">Show Digital QR</button>
                <a href="pass_status.html" class="border border-primary text-primary font-label-sm text-label-sm px-6 py-3 rounded-xl hover:bg-primary/5 transition-colors">View History</a>
            </div>
        `;
    } else {
        container.innerHTML = `
            <div class="flex items-center gap-2 mb-4">
                <span class="flex h-3 w-3 rounded-full bg-outline"></span>
                <span class="font-label-sm text-label-sm text-on-surface-variant font-bold uppercase tracking-wider">No Active Pass</span>
            </div>
            <h3 class="font-h2 text-h2 text-on-background mb-2 tracking-tight">No Pass Found</h3>
            <p class="font-body-md text-body-md text-on-surface-variant mb-6">Apply for a bus pass to start commuting on campus.</p>
            <div class="flex gap-4">
                <a href="pass_application.html" class="bg-gradient-to-r from-primary to-secondary text-on-primary font-label-sm text-label-sm px-6 py-3 rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">Apply Now</a>
                <a href="pass_status.html" class="border border-primary text-primary font-label-sm text-label-sm px-6 py-3 rounded-xl hover:bg-primary/5 transition-colors">Check Status</a>
            </div>
        `;
    }
}

// ─── Pass Requests widget ──────────────────────────────────────────
function renderPassRequests(requests) {
    const container = document.getElementById('recent-requests-container');
    if (!container) return;

    if (!requests || requests.length === 0) {
        container.innerHTML = `<p class="text-on-surface-variant text-sm">No pass requests yet.</p>`;
        return;
    }

    container.innerHTML = requests.slice(0, 3).map(p => {
        const isApproved = p.status === 'approved';
        const isRejected = p.status === 'rejected';
        const icon  = isApproved ? 'check_circle' : isRejected ? 'cancel' : 'schedule';
        const color = isApproved ? 'primary' : isRejected ? 'error' : 'tertiary';
        const date  = p.applied_at
            ? new Date(p.applied_at).toLocaleDateString('en-IN', { day:'2-digit', month:'short' })
            : '';

        return `
        <div class="flex items-center gap-4 p-4 rounded-xl bg-surface-container-low border border-white/50">
            <div class="h-10 w-10 rounded-full bg-${color}/10 flex items-center justify-center flex-shrink-0">
                <span class="material-symbols-outlined text-${color}">${icon}</span>
            </div>
            <div class="flex-1 min-w-0">
                <p class="font-label-sm text-label-sm font-bold text-on-surface truncate">${p.route?.name || 'Pass Request'}</p>
                <p class="font-caption text-caption text-on-surface-variant capitalize">${p.status} · ${date}</p>
            </div>
            <span class="h-2 w-2 rounded-full bg-${color} flex-shrink-0"></span>
        </div>`;
    }).join('');
}

// ─── Recent Commutes widget ────────────────────────────────────────
function renderRecentCommutes(commutes) {
    const container = document.getElementById('recent-commutes-container');
    if (!container) return;

    if (!commutes || commutes.length === 0) {
        container.innerHTML = `
            <div class="flex flex-col items-center justify-center py-8 text-center text-on-surface-variant">
                <span class="material-symbols-outlined text-4xl mb-2 opacity-40">directions_bus</span>
                <p class="font-body-md text-body-md">No commute history yet.</p>
                <p class="font-caption text-caption mt-1">Your approved passes will appear here.</p>
            </div>`;
        return;
    }

    const statusLabel = {
        approved: 'Approved',
        pending:  'Pending Review',
        rejected: 'Rejected',
    };
    const statusColor = {
        approved: 'text-primary',
        pending:  'text-tertiary',
        rejected: 'text-error',
    };

    container.innerHTML = commutes.map(c => `
        <div class="flex items-center justify-between group cursor-pointer">
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-2xl bg-surface-container-highest flex items-center justify-center text-primary-container group-hover:bg-primary-container group-hover:text-on-primary-container transition-all flex-shrink-0">
                    <span class="material-symbols-outlined">directions_bus</span>
                </div>
                <div>
                    <p class="font-label-sm text-label-sm font-bold text-on-surface">${c.route_name}</p>
                    <p class="font-caption text-caption text-on-surface-variant">${c.date} · Route #${c.route_id}</p>
                </div>
            </div>
            <div class="text-right flex-shrink-0 ml-4">
                <p class="font-label-sm text-label-sm font-bold ${statusColor[c.status] || 'text-on-surface'}">${statusLabel[c.status] || c.status}</p>
                <p class="font-caption text-caption text-on-surface-variant">${c.reviewed_at || '—'}</p>
            </div>
        </div>`).join('');
}

// ─── Usage ring widget ─────────────────────────────────────────────
function renderUsageWidget(data) {
    const pct = data.weekly_usage_pct || 0;
    const circumference = 351.8;
    const offset = circumference - (pct / 100) * circumference;

    const ring = document.getElementById('usage-ring');
    if (ring) {
        ring.style.transition = 'stroke-dashoffset 0.8s ease';
        ring.setAttribute('stroke-dashoffset', offset.toFixed(2));
    }

    setText('usage-pct-display', `${pct}%`);

    if (pct === 0) {
        setText('usage-goal-label', 'No Activity Yet');
        setText('usage-goal-desc', 'Apply for a pass to start tracking your commute activity.');
    } else {
        const approved = data.approved_count || 0;
        const total    = data.total_requests || 0;
        setText('usage-goal-label', 'Pass Activity');
        setText('usage-goal-desc', `${approved} of ${total} requests approved. Keep using your pass!`);
    }
}

// ─── Available Routes widget ───────────────────────────────────────
function renderRoutesWidget(count) {
    setText('available-routes-count', count ?? '—');
    const badge = document.getElementById('routes-today-badge');
    if (badge) {
        badge.textContent = count > 0 ? `${count} Routes` : 'No Routes';
    }
}

// ─── Header & sidebar ──────────────────────────────────────────────
function renderHeader(profile, activePass) {
    document.querySelectorAll('.user-name-display').forEach(el => {
        el.textContent = profile?.name || 'Student';
    });

    const yearEl = document.getElementById('sidebar-academic-year');
    if (yearEl) {
        const year = new Date().getFullYear();
        yearEl.textContent = `Academic Year ${year - 1}–${year}`;
    }
}

// ─── Main init ─────────────────────────────────────────────────────
async function initDashboard() {
    Loader.show();
    try {
        const response = await api.get('/passenger/dashboard');

        if (!response || !response.success) {
            console.error('Dashboard fetch failed', response);
            return;
        }

        const data = response.data;
        SessionStore.setUser(data.profile);

        renderHeader(data.profile, data.active_pass);
        renderActivePass(data.active_pass);
        renderPassRequests(data.recent_requests);
        renderRecentCommutes(data.recent_commutes);
        renderRoutesWidget(data.available_routes);
        renderUsageWidget(data);

    } catch (e) {
        console.error('Dashboard error:', e);
    } finally {
        Loader.hide();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (initPassengerAuth()) initDashboard();
});

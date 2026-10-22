/**
 * Admin logic for CampusFlow
 * Requires utils.js and api.js
 */

// --- Routing ---
const views = ['dashboard', 'buses', 'routes', 'passes', 'passengers'];

function switchView(viewName) {
    views.forEach(v => {
        const el = document.getElementById(`${v}-view`);
        if (el) {
            if (v === viewName) {
                el.classList.remove('hidden');
                el.classList.add('block');
            } else {
                el.classList.add('hidden');
                el.classList.remove('block');
            }
        }
    });

    // Update active nav state
    views.forEach(v => {
        const nav = document.getElementById(`nav-${v}`);
        if (nav) {
            if (v === viewName) {
                nav.classList.add('bg-gradient-to-r', 'from-primary', 'to-secondary', 'text-on-primary');
                nav.classList.remove('text-on-surface-variant');
            } else {
                nav.classList.remove('bg-gradient-to-r', 'from-primary', 'to-secondary', 'text-on-primary');
                nav.classList.add('text-on-surface-variant');
            }
        }
    });

    // Initialize specific view data
    if (viewName === 'dashboard') loadDashboard();
    if (viewName === 'buses') loadBuses();
    if (viewName === 'routes') loadRoutes();
    if (viewName === 'passes') loadPasses();
    if (viewName === 'passengers') loadPassengers();
}

// --- Modals ---
function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

document.querySelectorAll('.close-modal-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const modal = e.target.closest('.fixed.inset-0');
        if (modal) closeModal(modal.id);
    });
});

// --- Dashboard ---
async function loadDashboard() {
    Loader.show();
    try {
        // Fetch stats and recent passes in parallel
        const [statsRes, passesRes] = await Promise.all([
            api.get('/admin/stats'),
            api.get('/admin/passes')
        ]);

        if (statsRes.success) {
            const stats = statsRes.data;
            document.getElementById('stat-passengers').textContent = stats.total_passengers.toLocaleString();
            document.getElementById('stat-buses').textContent = stats.active_buses;
            document.getElementById('stat-pending').textContent = stats.pending_requests;
            document.getElementById('stat-routes').textContent = stats.total_routes;

            // Update Distribution Chart
            document.getElementById('approved-percentage').textContent = `${stats.distribution.approved}%`;
            // Rotate the ring based on percentage (rough visual representation)
            const ring = document.getElementById('distribution-ring');
            if (ring) {
                const deg = (stats.distribution.approved / 100) * 360;
                ring.style.transform = `rotate(${deg}deg)`;
            }

            // Update Flow Chart
            const flowChart = document.getElementById('flow-chart');
            if (flowChart && stats.flow) {
                const maxCount = Math.max(...stats.flow.map(d => d.count), 1);
                flowChart.innerHTML = stats.flow.map(d => {
                    const height = (d.count / maxCount) * 100;
                    return `
                        <div class="w-full bg-primary-fixed-dim/30 rounded-t-lg relative group transition-all duration-500" style="height: ${Math.max(height, 5)}%">
                            <div class="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-opacity rounded-t-lg h-full"></div>
                            <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-surface p-1 rounded shadow-lg text-[10px] opacity-0 group-hover:opacity-100 transition-opacity z-20 whitespace-nowrap">${d.count} requests</div>
                            <span class="absolute -bottom-6 left-1/2 -translate-x-1/2 text-caption text-on-surface-variant">${d.day}</span>
                        </div>
                    `;
                }).join('');
            }
        }

        const passes = passesRes.data || [];
        const tbody = document.getElementById('recent-passes-table-body');
        if (tbody) {
            tbody.innerHTML = passes.slice(0, 5).map(p => `
                <tr class="hover:bg-primary/5 transition-colors">
                    <td class="px-6 py-4 flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full bg-primary-container/20 flex items-center justify-center text-primary font-bold text-[12px] uppercase">
                            ${p.passenger?.name ? p.passenger.name.substring(0, 2) : 'U'}
                        </div>
                        <span class="font-label-sm">${p.passenger?.name || 'Unknown'}</span>
                    </td>
                    <td class="px-6 py-4 text-on-surface-variant">USR-${p.passenger_id}</td>
                    <td class="px-6 py-4">
                        <span class="px-3 py-1 bg-surface-container-highest text-on-surface text-caption rounded-full">${p.route?.name || 'Route'}</span>
                    </td>
                    <td class="px-6 py-4 text-on-surface-variant">${new Date(p.applied_at).toLocaleDateString()}</td>
                    <td class="px-6 py-4">
                        <span class="flex items-center gap-1 capitalize ${p.status === 'approved' ? 'text-primary' : p.status === 'rejected' ? 'text-error' : 'text-tertiary'}">
                            <span class="w-2 h-2 rounded-full ${p.status === 'approved' ? 'bg-primary' : p.status === 'rejected' ? 'bg-error' : 'bg-tertiary'}"></span>
                            ${p.status}
                        </span>
                    </td>
                    <td class="px-6 py-4 text-right">
                        <button onclick="switchView('passes')" class="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors">
                            <span class="material-symbols-outlined">visibility</span>
                        </button>
                    </td>
                </tr>
            `).join('');
        }
    } catch (e) {
        console.error(e);
    } finally {
        Loader.hide();
    }
}

// --- Buses ---
let allBuses = [];
async function loadBuses() {
    Loader.show();
    try {
        const response = await api.get('/admin/buses');
        allBuses = response.data || [];
        const tbody = document.getElementById('buses-table-body');
        if (tbody) {
            tbody.innerHTML = allBuses.map(bus => `
                <tr class="hover:bg-primary/5 transition-colors">
                    <td class="px-6 py-4 font-label-sm">${bus.bus_number}</td>
                    <td class="px-6 py-4 text-on-surface-variant">${bus.capacity} seats</td>
                    <td class="px-6 py-4">
                        <span class="px-3 py-1 bg-primary/10 text-primary text-[12px] font-bold rounded-full">Active</span>
                    </td>
                    <td class="px-6 py-4 text-right space-x-2">
                        <button onclick="editBus(${bus.id})" class="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"><span class="material-symbols-outlined text-[18px]">edit</span></button>
                        <button onclick="deleteBus(${bus.id})" class="p-2 text-error hover:bg-error/10 rounded-lg transition-colors"><span class="material-symbols-outlined text-[18px]">delete</span></button>
                    </td>
                </tr>
            `).join('');
        }
    } catch (e) {
        ErrorHandler.showError("Failed to load buses");
    } finally {
        Loader.hide();
    }
}

window.editBus = (id) => {
    const bus = allBuses.find(b => b.id === id);
    if (!bus) return;
    document.getElementById('bus-id').value = bus.id;
    document.getElementById('bus-number').value = bus.bus_number;
    document.getElementById('bus-capacity').value = bus.capacity;
    document.getElementById('bus-driver-name').value = bus.driver_name || '';
    document.getElementById('bus-driver-phone').value = bus.driver_phone || '';
    document.getElementById('bus-modal-title').textContent = 'Edit Bus';
    openModal('bus-modal');
};

window.deleteBus = async (id) => {
    if (confirm("Are you sure you want to delete this bus?")) {
        Loader.show();
        try {
            await api.delete(`/admin/buses/${id}`);
            loadBuses();
        } catch (e) {
            ErrorHandler.showError(e.message);
        } finally {
            Loader.hide();
        }
    }
};

document.getElementById('add-bus-btn')?.addEventListener('click', () => {
    document.getElementById('bus-form').reset();
    document.getElementById('bus-id').value = '';
    document.getElementById('bus-modal-title').textContent = 'Add Bus';
    openModal('bus-modal');
});

document.getElementById('bus-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('bus-id').value;
    const bus_number = document.getElementById('bus-number').value;
    const capacity = parseInt(document.getElementById('bus-capacity').value);
    const driver_name = document.getElementById('bus-driver-name').value;
    const driver_phone = document.getElementById('bus-driver-phone').value;

    Loader.show();
    try {
        if (id) {
            await api.put(`/admin/buses/${id}`, { bus_number, capacity, driver_name, driver_phone });
        } else {
            await api.post('/admin/buses', { bus_number, capacity, driver_name, driver_phone });
        }
        closeModal('bus-modal');
        loadBuses();
    } catch (err) {
        alert(err.message);
    } finally {
        Loader.hide();
    }
});

// --- Routes ---
let allRoutes = [];
async function loadRoutes() {
    Loader.show();
    try {
        // Load buses for dropdown
        const busResp = await api.get('/admin/buses');
        const busSelect = document.getElementById('route-bus-select');
        if (busSelect) {
            busSelect.innerHTML = '<option value="">None</option>' + 
                (busResp.data || []).map(b => `<option value="${b.id}">${b.bus_number}</option>`).join('');
        }

        const response = await api.get('/admin/routes');
        allRoutes = response.data || [];
        const container = document.getElementById('routes-grid-container');
        if (container) {
            container.innerHTML = allRoutes.map(route => `
                <div class="glass-card p-6 rounded-2xl flex flex-col justify-between">
                    <div class="flex justify-between items-start mb-4">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-xl bg-primary-container/20 flex items-center justify-center text-primary">
                                <span class="material-symbols-outlined">route</span>
                            </div>
                            <h3 class="font-h3 text-h3 text-on-background">${route.name}</h3>
                        </div>
                        <div class="flex gap-1">
                            <button onclick="editRoute(${route.id})" class="p-2 text-primary hover:bg-primary/10 rounded-lg"><span class="material-symbols-outlined text-[18px]">edit</span></button>
                            <button onclick="deleteRoute(${route.id})" class="p-2 text-error hover:bg-error/10 rounded-lg"><span class="material-symbols-outlined text-[18px]">delete</span></button>
                        </div>
                    </div>
                    <p class="text-on-surface-variant text-sm mb-4">${route.start_point} &rarr; ${route.end_point}</p>
                    <div class="flex items-center justify-between border-t border-outline-variant/20 pt-4 mt-auto">
                        <span class="text-caption text-on-surface-variant flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">schedule</span> ${route.timing}</span>
                        <span class="text-caption text-primary font-bold bg-primary/10 px-2 py-1 rounded-full flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">directions_bus</span> Bus ${route.bus_id || 'None'}</span>
                    </div>
                </div>
            `).join('');
        }
    } catch (e) {
        ErrorHandler.showError("Failed to load routes");
    } finally {
        Loader.hide();
    }
}

window.editRoute = (id) => {
    const route = allRoutes.find(r => r.id === id);
    if (!route) return;
    document.getElementById('route-id').value = route.id;
    document.getElementById('route-name').value = route.name;
    document.getElementById('route-start').value = route.start_point;
    document.getElementById('route-end').value = route.end_point;
    document.getElementById('route-timing').value = route.timing;
    document.getElementById('route-bus-select').value = route.bus_id || '';
    
    // Convert stops array to comma string for simple editing
    const stopsStr = route.stops ? route.stops.map(s => s.name).join(', ') : '';
    document.getElementById('route-stops').value = stopsStr;
    
    document.getElementById('route-modal-title').textContent = 'Edit Route';
    openModal('route-modal');
};

window.deleteRoute = async (id) => {
    if (confirm("Are you sure you want to delete this route?")) {
        Loader.show();
        try {
            await api.delete(`/admin/routes/${id}`);
            loadRoutes();
        } catch (e) {
            ErrorHandler.showError(e.message);
        } finally {
            Loader.hide();
        }
    }
};

document.getElementById('add-route-btn')?.addEventListener('click', () => {
    document.getElementById('route-form').reset();
    document.getElementById('route-id').value = '';
    document.getElementById('route-modal-title').textContent = 'Add Route';
    openModal('route-modal');
});

document.getElementById('route-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('route-id').value;
    const payload = {
        name: document.getElementById('route-name').value,
        start_point: document.getElementById('route-start').value,
        end_point: document.getElementById('route-end').value,
        timing: document.getElementById('route-timing').value,
        bus_id: parseInt(document.getElementById('route-bus-select').value) || null
    };

    const stopsStr = document.getElementById('route-stops').value;
    if (stopsStr.trim()) {
        payload.stops = stopsStr.split(',').map((name, i) => ({
            name: name.trim(),
            order: i + 1
        }));
    }

    Loader.show();
    try {
        if (id) {
            await api.put(`/admin/routes/${id}`, payload);
        } else {
            await api.post('/admin/routes', payload);
        }
        closeModal('route-modal');
        loadRoutes();
    } catch (err) {
        alert(err.message);
    } finally {
        Loader.hide();
    }
});


// --- Pass Approvals ---
async function loadPasses() {
    Loader.show();
    try {
        const filter = document.getElementById('pass-filter')?.value || '';
        const response = await api.get(`/admin/passes${filter ? '?status='+filter : ''}`);
        const passes = response.data || [];
        const tbody = document.getElementById('passes-table-body');
        if (tbody) {
            tbody.innerHTML = passes.map(p => `
                <tr class="hover:bg-primary/5 transition-colors">
                    <td class="px-6 py-4 font-label-sm">
                        <div>${p.passenger?.name || 'Unknown'}</div>
                        <div class="text-caption text-on-surface-variant">ID: USR-${p.passenger_id}</div>
                    </td>
                    <td class="px-6 py-4 text-on-surface-variant">${p.route?.name || 'N/A'}</td>
                    <td class="px-6 py-4 text-on-surface-variant">${new Date(p.applied_at).toLocaleDateString()}</td>
                    <td class="px-6 py-4">
                        <span class="px-3 py-1 text-[12px] font-bold rounded-full uppercase tracking-wider ${p.status === 'approved' ? 'bg-primary/10 text-primary' : p.status === 'rejected' ? 'bg-error/10 text-error' : 'bg-tertiary/10 text-tertiary'}">${p.status}</span>
                    </td>
                    <td class="px-6 py-4 text-right">
                        ${p.status === 'pending' ? `
                            <button onclick="openReviewModal(${p.id}, 'approve')" class="p-2 text-primary hover:bg-primary/10 rounded-lg"><span class="material-symbols-outlined text-[18px]">check_circle</span></button>
                            <button onclick="openReviewModal(${p.id}, 'reject')" class="p-2 text-error hover:bg-error/10 rounded-lg"><span class="material-symbols-outlined text-[18px]">cancel</span></button>
                        ` : `
                            <span class="text-caption text-outline">Reviewed</span>
                        `}
                    </td>
                </tr>
            `).join('');
        }
    } catch (e) {
        ErrorHandler.showError("Failed to load passes");
    } finally {
        Loader.hide();
    }
}

document.getElementById('pass-filter')?.addEventListener('change', loadPasses);

window.openReviewModal = (id, action) => {
    document.getElementById('review-request-id').value = id;
    document.getElementById('review-action').value = action;
    document.getElementById('review-prompt-msg').textContent = `Are you sure you want to ${action} this pass?`;
    document.getElementById('review-note').value = '';
    
    const btn = document.getElementById('confirm-review-btn');
    if (action === 'approve') {
        btn.className = 'px-6 py-2 rounded-xl font-bold shadow-md text-white bg-primary hover:bg-primary/90';
    } else {
        btn.className = 'px-6 py-2 rounded-xl font-bold shadow-md text-white bg-error hover:bg-error/90';
    }
    
    openModal('pass-review-modal');
};

document.getElementById('pass-review-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('review-request-id').value;
    const action = document.getElementById('review-action').value;
    const note = document.getElementById('review-note').value;

    Loader.show();
    try {
        await api.put(`/admin/passes/${id}/${action}`, { admin_note: note });
        closeModal('pass-review-modal');
        loadPasses();
    } catch (err) {
        alert(err.message);
    } finally {
        Loader.hide();
    }
});


// --- Passengers ---
async function loadPassengers() {
    Loader.show();
    try {
        const response = await api.get('/admin/passengers');
        const passengers = response.data || [];
        const tbody = document.getElementById('passengers-table-body');
        if (tbody) {
            tbody.innerHTML = passengers.map(p => `
                <tr class="hover:bg-primary/5 transition-colors">
                    <td class="px-6 py-4 font-label-sm text-on-surface-variant">USR-${p.id}</td>
                    <td class="px-6 py-4">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary font-bold text-[12px] uppercase">
                                ${p.name ? p.name.substring(0, 2) : 'U'}
                            </div>
                            <span class="font-label-sm">${p.name || 'Unknown'}</span>
                        </div>
                    </td>
                    <td class="px-6 py-4 text-on-surface-variant">${p.email}</td>
                    <td class="px-6 py-4 text-on-surface-variant">${p.phone || 'N/A'}</td>
                </tr>
            `).join('');
        }
    } catch (e) {
        ErrorHandler.showError("Failed to load passengers");
    } finally {
        Loader.hide();
    }
}


// --- Init ---
document.addEventListener('DOMContentLoaded', () => {
    if (!SessionStore.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }

    views.forEach(v => {
        document.getElementById(`nav-${v}`)?.addEventListener('click', (e) => {
            e.preventDefault();
            switchView(v);
        });
    });

    document.querySelectorAll('.logout-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            SessionStore.clearSession();
            window.location.href = 'login.html';
        });
    });

    // Start with dashboard
    switchView('dashboard');
});

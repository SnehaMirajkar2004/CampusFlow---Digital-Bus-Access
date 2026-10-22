/**
 * Public Routes Integration
 * Requires api.js and utils.js to be loaded first
 */

let allRoutes = [];

// Template functions
function createRouteCard(route) {
    const isExpress = route.name.toLowerCase().includes('express');
    const colorClass = isExpress ? 'primary' : 'secondary';
    
    // Safely count stops if array exists
    const stopCount = (route.stops && Array.isArray(route.stops)) ? route.stops.length : 'Multiple';
    
    return `
        <div class="glass-card p-stack-md rounded-3xl border-l-4 border-l-${colorClass} group cursor-pointer hover:translate-y-[-4px] transition-all">
            <div class="flex justify-between items-start mb-4">
                <div class="w-12 h-12 rounded-2xl bg-${colorClass}-container/10 flex items-center justify-center text-${colorClass}">
                    <span class="material-symbols-outlined">directions_bus</span>
                </div>
                <span class="bg-${colorClass}/10 text-${colorClass} px-3 py-1 rounded-full font-label-sm text-[12px]">${isExpress ? 'Express' : 'Standard'}</span>
            </div>
            <h3 class="font-h3 text-h3 text-on-background">${route.name}</h3>
            <p class="text-on-surface-variant font-body-md mt-1 mb-6">${route.start_point} ↔ ${route.end_point}</p>
            <div class="space-y-3">
                <div class="flex items-center gap-3 text-on-surface-variant">
                    <span class="material-symbols-outlined text-[20px]">schedule</span>
                    <span class="text-label-sm">${route.timing || 'Scheduled'}</span>
                </div>
                <div class="flex items-center gap-3 text-on-surface-variant">
                    <span class="material-symbols-outlined text-[20px]">location_on</span>
                    <span class="text-label-sm">${stopCount} Stops</span>
                </div>
            </div>
        </div>
    `;
}

function createSidebarRoute(route) {
    const isExpress = route.name.toLowerCase().includes('express');
    const colorClass = isExpress ? 'primary' : 'secondary';
    const stopCount = (route.stops && Array.isArray(route.stops)) ? route.stops.length : 0;
    
    return `
        <div class="flex items-center gap-4 p-3 hover:bg-primary-container/5 rounded-2xl transition-colors cursor-pointer group">
            <div class="flex flex-col items-center">
                <div class="w-1.5 h-1.5 bg-${colorClass} rounded-full"></div>
                <div class="w-0.5 h-8 bg-outline-variant/30"></div>
                <div class="w-1.5 h-1.5 bg-outline-variant rounded-full"></div>
            </div>
            <div class="flex-1">
                <div class="font-label-sm font-semibold text-on-background group-hover:text-${colorClass}">${route.name}</div>
                <div class="text-caption text-on-surface-variant">${stopCount} stops</div>
            </div>
            <div class="text-right">
                <div class="text-label-sm font-bold text-on-surface">${route.timing || 'Now'}</div>
                <div class="text-caption text-outline">Scheduled</div>
            </div>
        </div>
    `;
}

function renderSkeletons() {
    const container = document.getElementById('routes-container');
    const sidebar = document.getElementById('sidebar-routes-container');
    
    if (!container || !sidebar) return;

    const skeletonCard = `
        <div class="glass-card p-stack-md rounded-3xl border-l-4 border-l-outline-variant/30 animate-pulse">
            <div class="flex justify-between items-start mb-4">
                <div class="w-12 h-12 rounded-2xl bg-surface-variant flex items-center justify-center"></div>
                <div class="w-16 h-6 bg-surface-variant rounded-full"></div>
            </div>
            <div class="w-3/4 h-8 bg-surface-variant rounded mt-2"></div>
            <div class="w-full h-5 bg-surface-variant rounded mt-3 mb-6"></div>
            <div class="space-y-3">
                <div class="flex items-center gap-3">
                    <div class="w-5 h-5 bg-surface-variant rounded"></div>
                    <div class="w-1/2 h-4 bg-surface-variant rounded"></div>
                </div>
                <div class="flex items-center gap-3">
                    <div class="w-5 h-5 bg-surface-variant rounded"></div>
                    <div class="w-2/3 h-4 bg-surface-variant rounded"></div>
                </div>
            </div>
        </div>
    `;
    container.innerHTML = skeletonCard.repeat(4);
    
    const skeletonSidebar = `
        <div class="flex items-center gap-4 p-3 rounded-2xl animate-pulse">
            <div class="w-2 h-12 bg-surface-variant rounded-full"></div>
            <div class="flex-1 space-y-2">
                <div class="w-3/4 h-4 bg-surface-variant rounded"></div>
                <div class="w-1/2 h-3 bg-surface-variant rounded"></div>
            </div>
            <div class="w-12 h-6 bg-surface-variant rounded"></div>
        </div>
    `;
    sidebar.innerHTML = skeletonSidebar.repeat(5);
}

function renderRoutes(routes) {
    const container = document.getElementById('routes-container');
    const sidebar = document.getElementById('sidebar-routes-container');
    
    if (!container || !sidebar) return;

    if (routes.length === 0) {
        container.innerHTML = `<div class="col-span-full text-center py-8 text-on-surface-variant">No routes found matching your criteria.</div>`;
        sidebar.innerHTML = `<div class="text-center py-4 text-caption text-on-surface-variant">No routes</div>`;
        return;
    }

    container.innerHTML = routes.map(createRouteCard).join('');
    sidebar.innerHTML = routes.map(createSidebarRoute).join('');
}

async function loadRoutes() {
    renderSkeletons();
    try {
        const response = await api.get('/routes');
        if (response && response.success) {
            allRoutes = response.data;
            renderRoutes(allRoutes);
        } else {
            console.error("Failed to load routes from backend.");
        }
    } catch (error) {
        console.error("Error loading routes:", error);
        const container = document.getElementById('routes-container');
        if (container) {
            container.innerHTML = `<div class="col-span-full text-center py-8 text-error">Failed to load routes. Please try again later.</div>`;
        }
    }
}

function handleSearch() {
    const queryEl = document.getElementById('search-input');
    const zoneEl = document.getElementById('zone-select');
    
    if (!queryEl || !zoneEl) return;

    const query = queryEl.value.toLowerCase();
    const zone = zoneEl.value;
    
    const filtered = allRoutes.filter(route => {
        const name = (route.name || '').toLowerCase();
        const start = (route.start_point || '').toLowerCase();
        const end = (route.end_point || '').toLowerCase();
        
        const matchesQuery = name.includes(query) || start.includes(query) || end.includes(query);
        
        // Mock zone filtering based on keywords in name or start/end points
        let matchesZone = true;
        if (zone !== 'all') {
            matchesZone = name.includes(zone) || start.includes(zone) || end.includes(zone);
        }
        
        return matchesQuery && matchesZone;
    });
    
    renderRoutes(filtered);
}

document.addEventListener('DOMContentLoaded', () => {
    loadRoutes();
    
    const searchInput = document.getElementById('search-input');
    const zoneSelect = document.getElementById('zone-select');
    const searchButton = document.getElementById('search-button');

    if (searchInput) searchInput.addEventListener('input', handleSearch);
    if (zoneSelect) zoneSelect.addEventListener('change', handleSearch);
    if (searchButton) {
        searchButton.addEventListener('click', (e) => {
            e.preventDefault();
            handleSearch();
        });
    }
});

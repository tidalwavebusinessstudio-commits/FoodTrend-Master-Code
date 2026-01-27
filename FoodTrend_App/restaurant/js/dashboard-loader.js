/**
 * FoodTrend Component Loader - WITH Collapsibility
 * Original design preserved, collapse functionality added
 */

// ============================================================================
// SIDEBAR TEMPLATE (FoodTrend Original Design + Collapse Feature)
// ============================================================================
const SIDEBAR_HTML = `
<aside class="sidebar" id="mainSidebar" data-collapsed="false" style="position: fixed; left: 0; top: 0; bottom: 0; width: 250px; z-index: 1000; overflow-y: auto; background: rgba(10, 10, 15, 0.95); backdrop-filter: blur(20px); border-right: 1px solid rgba(255, 255, 255, 0.1); box-shadow: 4px 0 24px rgba(0,0,0,0.4); transition: width 0.3s ease;">
    
    <!-- Toggle Button (NEW) -->
    <div class="sidebar-toggle" onclick="toggleSidebar()" style="padding: 20px; cursor: pointer; color: #8b92a7; font-size: 24px; text-align: left; transition: color 0.2s;">
        <span class="toggle-icon">☰</span>
    </div>

    <!-- Logo (Original) -->
    <div class="logo" style="padding: 0px 16px 24px 16px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.05); transition: padding 0.3s;">
        <a href="dashboard.html">
            <img src="https://storage.googleapis.com/msgsndr/94dt2MB1WHxUt3L0lur8/media/6976c136c1fa0cdde0a69f84.png" alt="FoodTrend" class="logo-img" style="height: 40px; width: auto; filter: drop-shadow(0 2px 8px rgba(255,70,90,0.3)); transition: height 0.3s;">
        </a>
    </div>
    
    <!-- Navigation (Original Emoji Design) -->
    <nav style="padding: 16px 0;">
        <a href="dashboard.html" class="nav-item" data-page="dashboard" style="display: flex; align-items: center; padding: 14px 20px; color: #fff; text-decoration: none; transition: all 0.2s; border-left: 3px solid transparent;">
            <span class="nav-icon" style="font-size: 1.3rem; min-width: 1.3rem; margin-right: 12px; transition: margin 0.3s;">📊</span>
            <span class="nav-text" style="font-weight: 600; opacity: 1; transition: opacity 0.3s;">Overview</span>
        </a>
        
        <a href="gigs.html" class="nav-item" data-page="gigs" style="display: flex; align-items: center; padding: 14px 20px; color: #fff; text-decoration: none; transition: all 0.2s; border-left: 3px solid transparent;">
            <span class="nav-icon" style="font-size: 1.3rem; min-width: 1.3rem; margin-right: 12px; transition: margin 0.3s;">🔥</span>
            <span class="nav-text" style="font-weight: 600; opacity: 1; transition: opacity 0.3s;">Gigs</span>
        </a>
        
        <a href="calendar.html" class="nav-item" data-page="calendar" style="display: flex; align-items: center; padding: 14px 20px; color: #fff; text-decoration: none; transition: all 0.2s; border-left: 3px solid transparent;">
            <span class="nav-icon" style="font-size: 1.3rem; min-width: 1.3rem; margin-right: 12px; transition: margin 0.3s;">📅</span>
            <span class="nav-text" style="font-weight: 600; opacity: 1; transition: opacity 0.3s;">Calendar</span>
        </a>
        
        <a href="announcements.html" class="nav-item" data-page="announcements" style="display: flex; align-items: center; padding: 14px 20px; color: #fff; text-decoration: none; transition: all 0.2s; border-left: 3px solid transparent;">
            <span class="nav-icon" style="font-size: 1.3rem; min-width: 1.3rem; margin-right: 12px; transition: margin 0.3s;">📢</span>
            <span class="nav-text" style="font-weight: 600; opacity: 1; transition: opacity 0.3s;">Announcements</span>
        </a>
        
        <a href="feedback.html" class="nav-item" data-page="feedback" style="display: flex; align-items: center; padding: 14px 20px; color: #fff; text-decoration: none; transition: all 0.2s; border-left: 3px solid transparent;">
            <span class="nav-icon" style="font-size: 1.3rem; min-width: 1.3rem; margin-right: 12px; transition: margin 0.3s;">⭐</span>
            <span class="nav-text" style="font-weight: 600; opacity: 1; transition: opacity 0.3s;">Feedback</span>
        </a>
        
        <a href="trends.html" class="nav-item" data-page="trends" style="display: flex; align-items: center; padding: 14px 20px; color: #fff; text-decoration: none; transition: all 0.2s; border-left: 3px solid transparent;">
            <span class="nav-icon" style="font-size: 1.3rem; min-width: 1.3rem; margin-right: 12px; transition: margin 0.3s;">📈</span>
            <span class="nav-text" style="font-weight: 600; opacity: 1; transition: opacity 0.3s;">Trends</span>
        </a>
        
        <a href="integrations.html" class="nav-item" data-page="integrations" style="display: flex; align-items: center; padding: 14px 20px; color: #fff; text-decoration: none; transition: all 0.2s; border-left: 3px solid transparent;">
            <span class="nav-icon" style="font-size: 1.3rem; min-width: 1.3rem; margin-right: 12px; transition: margin 0.3s;">⚙️</span>
            <span class="nav-text" style="font-weight: 600; opacity: 1; transition: opacity 0.3s;">Integrations</span>
        </a>
    </nav>

    <!-- Theme Toggle Switch -->
    <div class="theme-toggle-row" style="margin: 20px 20px 0 20px;">
        <span class="theme-toggle-label nav-text">Dark Mode</span>
        <label class="theme-switch" title="Toggle Light/Dark Mode">
            <input type="checkbox" class="theme-switch-input">
            <span class="theme-switch-slider">
                <span class="theme-switch-icon sun">☀️</span>
                <span class="theme-switch-icon moon">🌙</span>
            </span>
        </label>
    </div>

    <!-- Footer (Original) -->
    <div style="position: absolute; bottom: 20px; left: 20px; right: 20px; transition: opacity 0.3s;" class="sidebar-footer">
        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 16px; text-align: center;">
            <small style="color: #888; display: block; margin-bottom: 8px;">🔮 AI Insights Active</small>
            <small style="color: #666; font-size: 0.75rem;">Powered by FoodTrend</small>
        </div>
    </div>
</aside>

<style>
    /* Original FoodTrend Styles */
    .nav-item:hover {
        background: rgba(255, 255, 255, 0.05) !important;
        border-left-color: rgba(255, 70, 90, 0.5) !important;
    }
    
    .nav-item.active {
        background: rgba(255, 70, 90, 0.1) !important;
        border-left-color: #ff465a !important;
        color: #ff465a !important;
    }

    .sidebar-toggle:hover {
        color: #ffffff !important;
    }

    /* Collapsed State Modifications */
    .sidebar[data-collapsed="true"] {
        width: 70px !important;
    }

    .sidebar[data-collapsed="true"] .nav-text {
        opacity: 0 !important;
        width: 0 !important;
    }

    .sidebar[data-collapsed="true"] .sidebar-footer {
        opacity: 0 !important;
    }

    .sidebar[data-collapsed="true"] .logo {
        padding: 10px 5px 20px 5px !important;
        overflow: hidden !important;
    }

    .sidebar[data-collapsed="true"] .logo-img {
        height: 28px !important;
        max-width: 55px !important;
        object-fit: contain !important;
        object-position: left center !important;
    }

    .sidebar[data-collapsed="true"] .nav-icon {
        margin-right: 0 !important;
    }

    .sidebar[data-collapsed="true"] .nav-item {
        justify-content: center !important;
        padding: 14px 10px !important;
    }

    .sidebar[data-collapsed="true"] .sidebar-toggle {
        text-align: center !important;
    }
</style>
`;

// ============================================================================
// LOADER & COLLAPSE FUNCTIONALITY
// ============================================================================

document.addEventListener("DOMContentLoaded", function () {
    loadSidebar();
});

function loadSidebar() {
    const container = document.getElementById("sidebar-container");

    if (!container) {
        console.warn("⚠️ No #sidebar-container found");
        return;
    }

    try {
        container.innerHTML = SIDEBAR_HTML;
        setActiveLink();
        restoreCollapseState();
        loadThemeToggleScript();
        console.log("✅ Sidebar loaded");
    } catch (error) {
        console.error("❌ Sidebar load failed:", error);
    }
}

// Load theme toggle script dynamically
function loadThemeToggleScript() {
    if (window.FoodTrendTheme) return; // Already loaded

    const script = document.createElement('script');
    script.src = '../js/theme-toggle.js';
    script.onload = function () {
        console.log("✅ Theme toggle loaded");
        // Re-apply theme after script loads
        if (window.FoodTrendTheme) {
            window.FoodTrendTheme.apply(window.FoodTrendTheme.get());
        }
    };
    document.head.appendChild(script);
}

function setActiveLink() {
    const path = window.location.pathname;
    const currentPage = path.split("/").pop() || 'dashboard.html';

    const links = document.querySelectorAll('.nav-item[data-page]');
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        }
    });
}

// NEW: Collapse/Expand Toggle (GHL-inspired functionality)
window.toggleSidebar = function () {
    const sidebar = document.getElementById('mainSidebar');
    const isCollapsed = sidebar.getAttribute('data-collapsed') === 'true';

    sidebar.setAttribute('data-collapsed', !isCollapsed);
    localStorage.setItem('foodtrend_sidebar_collapsed', !isCollapsed);
};

function restoreCollapseState() {
    const collapsed = localStorage.getItem('foodtrend_sidebar_collapsed') === 'true';
    if (collapsed) {
        const sidebar = document.getElementById('mainSidebar');
        sidebar.setAttribute('data-collapsed', 'true');
    }
}

// Health check
window.checkSidebarHealth = function () {
    console.clear();
    console.log("%c 🏥 Sidebar Health ", "background: #1a1a1f; color: #ff465a; padding: 10px;");

    const sidebar = document.getElementById('mainSidebar');
    if (!sidebar) {
        console.error("❌ Sidebar not found");
        return;
    }

    console.log("✅ Sidebar rendered");
    console.log("📊 State:", sidebar.getAttribute('data-collapsed') === 'true' ? 'Collapsed' : 'Expanded');
    console.log("📍 Links:", sidebar.querySelectorAll('.nav-item').length);
    console.log("%c 🎉 Check Complete ", "background: #1a1a1f; color: #4ade80; padding: 8px;");
};

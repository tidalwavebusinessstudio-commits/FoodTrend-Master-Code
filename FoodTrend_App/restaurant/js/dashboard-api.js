/**
 * Dashboard API - Restaurant Dashboard Data Fetcher
 * Wires the restaurant dashboard to Supabase via backend API
 * 
 * Pattern: Matches influencer-stats.js for consistency
 */

const API_BASE = window.FOODTREND_API_BASE || '/api';

/**
 * Get restaurant ID from context
 */
function getRestaurantId() {
    // Try from URL param
    const params = new URLSearchParams(window.location.search);
    if (params.get('restaurantId')) return params.get('restaurantId');

    // Try from localStorage
    if (localStorage.getItem('ft_restaurant_id')) return localStorage.getItem('ft_restaurant_id');

    // Try from global context
    if (window.FOODTREND_RESTAURANT_ID) return window.FOODTREND_RESTAURANT_ID;

    // Demo mode - return null
    return null;
}

/**
 * Format large numbers (e.g., 12500 → "12.5k")
 */
function formatNumber(num) {
    if (!num || num === 0) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
}

/**
 * Demo data for development/preview
 */
function getDemoDashboardData() {
    return {
        restaurant: {
            name: 'Burger Bar Downtown',
            tier: 'pro'
        },
        stats: {
            activeOffers: 2,
            totalViews: 12500,
            estimatedWalkIns: 45,
            avgRating: 4.8,
            viewsChange: 15 // percent vs last month
        },
        contentMetrics: {
            totalContent: 24,
            totalViews: 12500,
            platformBreakdown: { tiktok: 15, instagram: 9 }
        },
        chartData: {
            labels: ['Feb 1', 'Feb 5', 'Feb 10', 'Feb 15', 'Feb 20', 'Feb 25', 'Mar 1'],
            values: [5000, 6200, 7500, 8900, 10500, 11200, 12500]
        }
    };
}

/**
 * Fetch dashboard data from API
 */
async function fetchDashboardData() {
    const restaurantId = getRestaurantId();

    // If no restaurant ID, use demo data
    if (!restaurantId) {
        console.log('[DashboardAPI] No restaurant ID, using demo data');
        return getDemoDashboardData();
    }

    try {
        const response = await fetch(`${API_BASE}/restaurant/${restaurantId}/dashboard`);
        if (!response.ok) throw new Error(`API error: ${response.status}`);

        const data = await response.json();

        // Transform API response to match expected format
        return {
            restaurant: data.restaurant,
            stats: {
                activeOffers: data.recentGigs?.filter(g => g.status === 'active').length || 0,
                totalViews: data.contentMetrics?.totalViews || 0,
                estimatedWalkIns: Math.round((data.contentMetrics?.totalViews || 0) * 0.012), // 1.2% conversion
                avgRating: 4.8, // TODO: Wire from reviews API when ready
                viewsChange: 15 // TODO: Calculate from historical data
            },
            contentMetrics: data.contentMetrics,
            chartData: generateChartData(data.contentMetrics),
            recentGigs: data.recentGigs,
            influencerNetwork: data.influencerNetwork
        };
    } catch (error) {
        console.error('[DashboardAPI] API error:', error);
        return getDemoDashboardData();
    }
}

/**
 * Generate chart data from content metrics
 * TODO: Replace with actual time-series data from API
 */
function generateChartData(metrics) {
    // For now, generate sample progression data
    const totalViews = metrics?.totalViews || 12500;
    const baseViews = Math.round(totalViews * 0.4);

    return {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7'],
        values: [
            baseViews,
            Math.round(baseViews * 1.15),
            Math.round(baseViews * 1.35),
            Math.round(baseViews * 1.55),
            Math.round(baseViews * 1.75),
            Math.round(baseViews * 1.90),
            totalViews
        ]
    };
}

/**
 * Populate dashboard KPIs
 */
function populateDashboardStats(data) {
    // Restaurant name
    const nameEl = document.querySelector('.text-primary.font-weight-bold');
    if (nameEl && data.restaurant?.name) {
        nameEl.textContent = data.restaurant.name;
    }

    // Active Offers
    const offersEl = document.getElementById('stat-active-offers');
    if (offersEl) offersEl.textContent = data.stats.activeOffers;

    // Total Views
    const viewsEl = document.getElementById('stat-total-views');
    if (viewsEl) viewsEl.textContent = formatNumber(data.stats.totalViews);

    // Estimated Walk-ins
    const walkInsEl = document.getElementById('stat-walk-ins');
    if (walkInsEl) walkInsEl.textContent = '~' + data.stats.estimatedWalkIns;

    // Average Rating
    const ratingEl = document.getElementById('stat-avg-rating');
    if (ratingEl) ratingEl.textContent = data.stats.avgRating;
}

/**
 * Update momentum chart with real data
 */
function updateMomentumChart(chartData) {
    const ctx = document.getElementById('momentumChart');
    if (!ctx) return;

    // Destroy existing chart if it exists
    if (window.momentumChartInstance) {
        window.momentumChartInstance.destroy();
    }

    window.momentumChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartData.labels,
            datasets: [{
                label: 'Total Views',
                data: chartData.values,
                borderColor: '#EB1700', // DoorDash Red
                backgroundColor: 'rgba(235, 23, 0, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    ticks: {
                        color: '#8892b0',
                        callback: function (value) {
                            return formatNumber(value);
                        }
                    }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#8892b0' }
                }
            }
        }
    });
}

/**
 * Initialize dashboard
 */
async function initDashboard() {
    try {
        const data = await fetchDashboardData();
        populateDashboardStats(data);
        updateMomentumChart(data.chartData);
        console.log('[DashboardAPI] Loaded successfully');
    } catch (error) {
        console.error('[DashboardAPI] Init error:', error);
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', initDashboard);

// Export for external use
window.FoodTrendDashboard = {
    refresh: initDashboard,
    getRestaurantId
};

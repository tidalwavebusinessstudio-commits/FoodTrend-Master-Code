/**
 * Influencer Stats Loader
 * Fetches and displays influencer metrics on dashboard
 */

// Configuration - update with your API base URL
const API_BASE = window.FOODTREND_API_BASE || '/api';

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
 * Fetch influencer stats from API
 */
async function fetchInfluencerStats() {
    const restaurantId = getRestaurantId();

    // If no restaurant ID, show demo data
    if (!restaurantId) {
        console.log('[InfluencerStats] No restaurant ID, using demo data');
        return getDemoStats();
    }

    try {
        const response = await fetch(`${API_BASE}/influencers/stats?restaurantId=${restaurantId}`);
        if (!response.ok) throw new Error('Failed to fetch stats');
        return await response.json();
    } catch (error) {
        console.error('[InfluencerStats] API error:', error);
        return getDemoStats();
    }
}

/**
 * Demo data for development/preview
 */
function getDemoStats() {
    return {
        totalInfluencers: 8,
        totalFollowers: 145000,
        avgEngagement: 4.2,
        tierBreakdown: {
            macro: 1,
            midTier: 3,
            micro: 4
        },
        topPerformers: [
            { id: '1', name: 'Victory Lap', handle: '@victorylap', followers: 52000, engagement: 5.8 },
            { id: '2', name: 'Troy Boy', handle: '@troyboy', followers: 34000, engagement: 4.2 },
            { id: '3', name: 'Kevin Fly', handle: '@kevinfly', followers: 28000, engagement: 3.9 },
            { id: '4', name: 'John', handle: '@johneats', followers: 15000, engagement: 6.1 },
            { id: '5', name: 'Test Giy', handle: '@testgiy', followers: 8500, engagement: 3.2 }
        ]
    };
}

/**
 * Populate the UI with stats
 */
function populateInfluencerStats(stats) {
    // Total Influencers
    const totalEl = document.getElementById('stat-total-influencers');
    if (totalEl) totalEl.textContent = stats.totalInfluencers || 0;

    // Total Reach
    const reachEl = document.getElementById('stat-total-reach');
    if (reachEl) reachEl.textContent = formatNumber(stats.totalFollowers);

    // Avg Engagement
    const engagementEl = document.getElementById('stat-avg-engagement');
    if (engagementEl) engagementEl.textContent = (stats.avgEngagement || 0) + '%';

    // Tier breakdown
    const macroEl = document.getElementById('tier-macro');
    const midEl = document.getElementById('tier-mid');
    const microEl = document.getElementById('tier-micro');

    if (macroEl) macroEl.textContent = (stats.tierBreakdown?.macro || 0) + ' Macro';
    if (midEl) midEl.textContent = (stats.tierBreakdown?.midTier || 0) + ' Mid';
    if (microEl) microEl.textContent = (stats.tierBreakdown?.micro || 0) + ' Micro';

    // Top performers table
    const tbody = document.getElementById('top-performers-body');
    if (tbody && stats.topPerformers?.length > 0) {
        tbody.innerHTML = stats.topPerformers.map(p => `
      <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
        <td style="padding: 12px 0; font-weight: 600;">${p.name}</td>
        <td style="padding: 12px 0; color: #888;">${p.handle}</td>
        <td style="padding: 12px 0; text-align: right;">${formatNumber(p.followers)}</td>
        <td style="padding: 12px 0; text-align: right;">
          <span class="badge badge-success">${p.engagement}%</span>
        </td>
      </tr>
    `).join('');
    } else if (tbody) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 24px; color: #666;">No influencers yet</td></tr>';
    }
}

/**
 * Initialize on page load
 */
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const stats = await fetchInfluencerStats();
        populateInfluencerStats(stats);
        console.log('[InfluencerStats] Loaded successfully');
    } catch (error) {
        console.error('[InfluencerStats] Init error:', error);
    }
});

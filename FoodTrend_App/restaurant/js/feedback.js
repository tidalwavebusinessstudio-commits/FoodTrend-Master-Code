/**
 * Feedback Dashboard JavaScript
 * Fetches and displays restaurant feedback from the Review Gating System
 */

const API_BASE = window.API_BASE_URL || 'https://api.yourfoodtrend.com';

// Get restaurant ID from session/localStorage (placeholder - integrate with auth)
function getRestaurantId() {
    return localStorage.getItem('restaurantId') || 'demo-restaurant-id';
}

/**
 * Fetch feedback data from API
 */
async function fetchFeedback() {
    const restaurantId = getRestaurantId();

    try {
        const response = await fetch(`${API_BASE}/api/reviews/restaurant/${restaurantId}/feedback`);
        if (!response.ok) throw new Error('Failed to fetch feedback');
        return await response.json();
    } catch (error) {
        console.error('[Feedback] Error fetching data:', error);
        // Return demo data for development
        return getDemoData();
    }
}

/**
 * Demo data for development/preview
 */
function getDemoData() {
    return {
        stats: {
            total: 24,
            averageRating: 4.2,
            internalCount: 6,
            googlePendingCount: 3,
            googlePostedCount: 15,
            byRating: { 1: 1, 2: 2, 3: 3, 4: 8, 5: 10 }
        },
        recentFeedback: [
            {
                id: '1',
                star_rating: 2,
                comment: 'The food was cold and the server was rude when I asked for water.',
                feedback_type: 'internal',
                created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                influencer: { full_name: 'Sarah M.', instagram_handle: 'AngryEater' }
            },
            {
                id: '2',
                star_rating: 5,
                comment: 'Amazing vibes! The burger was juicy. Posted a reel already.',
                feedback_type: 'google_posted',
                created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
                influencer: { full_name: 'Mike T.', instagram_handle: 'HappyChef' }
            },
            {
                id: '3',
                star_rating: 3,
                comment: 'Food was okay, nothing special. Service could be faster.',
                feedback_type: 'internal',
                created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                influencer: { full_name: 'Lisa R.', instagram_handle: 'FoodieQueen' }
            },
            {
                id: '4',
                star_rating: 5,
                comment: 'Best tacos in the city! The salsa is fire 🔥',
                feedback_type: 'google_pending',
                created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
                influencer: { full_name: 'Carlos G.', instagram_handle: 'TacoKing' }
            }
        ],
        internalFeedback: []
    };
}

/**
 * Render stats cards
 */
function renderStats(stats) {
    const statsContainer = document.getElementById('stats-container');
    if (!statsContainer) return;

    statsContainer.innerHTML = `
        <div class="stat-card">
            <div class="stat-value">${stats.total}</div>
            <div class="stat-label">Total Reviews</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${stats.averageRating.toFixed(1)} ⭐</div>
            <div class="stat-label">Average Rating</div>
        </div>
        <div class="stat-card">
            <div class="stat-value text-success">${stats.googlePostedCount}</div>
            <div class="stat-label">Google Reviews</div>
        </div>
        <div class="stat-card">
            <div class="stat-value text-warning">${stats.googlePendingCount}</div>
            <div class="stat-label">Pending Google</div>
        </div>
        <div class="stat-card">
            <div class="stat-value text-danger">${stats.internalCount}</div>
            <div class="stat-label">Private Feedback</div>
        </div>
    `;
}

/**
 * Get emoji based on star rating
 */
function getRatingEmoji(rating) {
    const emojis = {
        1: '😡',
        2: '😠',
        3: '😐',
        4: '😊',
        5: '🤩'
    };
    return emojis[rating] || '❓';
}

/**
 * Get CSS class for star rating
 */
function getRatingClass(rating) {
    if (rating >= 5) return 'text-success';
    if (rating >= 4) return 'text-warning';
    return 'text-danger';
}

/**
 * Get badge for feedback type
 */
function getTypeBadge(type) {
    const badges = {
        'internal': '<span class="status-badge" style="background: rgba(244, 67, 54, 0.1); color: var(--danger);">Private</span>',
        'neutral': '<span class="status-badge" style="background: rgba(255, 193, 7, 0.1); color: var(--warning);">Stored</span>',
        'google_pending': '<span class="status-badge" style="background: rgba(33, 150, 243, 0.1); color: #2196F3;">Pending Google</span>',
        'google_posted': '<span class="status-badge status-active">Posted to Google</span>'
    };
    return badges[type] || '';
}

/**
 * Format relative time
 */
function timeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return date.toLocaleDateString();
}

/**
 * Render feedback list
 */
function renderFeedback(feedbackList) {
    const container = document.getElementById('feedback-list');
    if (!container) return;

    if (!feedbackList || feedbackList.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="text-align: center; padding: 40px;">
                <p class="text-secondary">No feedback yet. Reviews will appear here as creators complete their visits.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = feedbackList.map(item => `
        <div class="feedback-item" data-id="${item.id}">
            <div class="feedback-header">
                <div class="feedback-meta">
                    <span class="rating-emoji">${getRatingEmoji(item.star_rating)}</span>
                    <span class="${getRatingClass(item.star_rating)}" style="font-weight: 700;">${item.star_rating}/5 Stars</span>
                    <span class="text-muted">@${item.influencer?.instagram_handle || 'Anonymous'} • ${timeAgo(item.created_at)}</span>
                </div>
                ${getTypeBadge(item.feedback_type)}
            </div>
            <p class="feedback-comment">${item.comment || 'No comment provided.'}</p>
            ${item.feedback_type === 'internal' ? `
                <div class="feedback-actions">
                    <button class="btn btn-outline btn-sm" onclick="replyPrivately('${item.id}')">Reply Privately</button>
                    <button class="btn btn-outline btn-sm" onclick="markResolved('${item.id}')">Mark Resolved</button>
                </div>
            ` : ''}
        </div>
    `).join('');
}

/**
 * Filter feedback by type
 */
function filterFeedback(type) {
    const items = document.querySelectorAll('.feedback-item');
    items.forEach(item => {
        if (type === 'all') {
            item.style.display = '';
        } else {
            // This would need data attributes on the items to work properly
            // For now, just show all
            item.style.display = '';
        }
    });

    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
}

/**
 * Reply privately to feedback
 */
function replyPrivately(feedbackId) {
    // Open modal or redirect to messaging
    alert(`Reply feature coming soon for feedback ${feedbackId}`);
}

/**
 * Mark feedback as resolved
 */
async function markResolved(feedbackId) {
    // In real implementation, call API to update status
    const item = document.querySelector(`[data-id="${feedbackId}"]`);
    if (item) {
        item.style.opacity = '0.5';
        item.querySelector('.feedback-actions').innerHTML = '<span class="text-success">✓ Resolved</span>';
    }
}

/**
 * Initialize the feedback dashboard
 */
async function initFeedbackDashboard() {
    console.log('[Feedback] Initializing dashboard...');

    // Show loading state
    const container = document.getElementById('feedback-list');
    if (container) {
        container.innerHTML = '<div class="loading">Loading feedback...</div>';
    }

    // Fetch data
    const data = await fetchFeedback();

    // Render
    renderStats(data.stats);
    renderFeedback(data.recentFeedback);

    console.log('[Feedback] Dashboard loaded', data.stats);
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', initFeedbackDashboard);

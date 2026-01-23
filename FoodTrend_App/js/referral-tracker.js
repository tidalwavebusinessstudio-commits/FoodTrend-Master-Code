/**
 * FoodTrend Referral Tracking System
 * 
 * Captures referral codes from URL/QR scans and attributes
 * restaurant signups to the correct influencer
 */

class ReferralTracker {
    constructor() {
        this.COOKIE_NAME = 'ftnd_ref';
        this.STORAGE_KEY = 'ftnd_referrer';
        this.COOKIE_DAYS = 30;
    }

    /**
     * Initialize tracking when page loads
     * Call this on every page where attribution matters
     */
    init() {
        const refCode = this.getRefCodeFromURL();

        if (refCode) {
            this.storeReferralCode(refCode);
            this.trackClick(refCode);
            this.cleanURL(); // Remove ref param from URL for cleaner UX
        }
    }

    /**
     * Get referral code from URL parameter
     * Supports: ?ref=CODE or ?referral=CODE
     */
    getRefCodeFromURL() {
        const params = new URLSearchParams(window.location.search);
        return params.get('ref') || params.get('referral');
    }

    /**
     * Store referral code in multiple places for reliability
     */
    storeReferralCode(refCode) {
        // Store in cookie (survives page refreshes)
        this.setCookie(this.COOKIE_NAME, refCode, this.COOKIE_DAYS);

        // Store in localStorage (backup if cookies disabled)
        try {
            localStorage.setItem(this.STORAGE_KEY, refCode);
            localStorage.setItem(`${this.STORAGE_KEY}_timestamp`, Date.now().toString());
        } catch (e) {
            console.warn('localStorage not available:', e);
        }

        // Store in sessionStorage (for current session)
        try {
            sessionStorage.setItem(this.STORAGE_KEY, refCode);
        } catch (e) {
            console.warn('sessionStorage not available:', e);
        }
    }

    /**
     * Retrieve stored referral code
     * Checks multiple sources in priority order
     */
    getStoredReferralCode() {
        // 1. Check URL (highest priority)
        let refCode = this.getRefCodeFromURL();
        if (refCode) return refCode;

        // 2. Check cookie
        refCode = this.getCookie(this.COOKIE_NAME);
        if (refCode) return refCode;

        // 3. Check sessionStorage
        try {
            refCode = sessionStorage.getItem(this.STORAGE_KEY);
            if (refCode) return refCode;
        } catch (e) { }

        // 4. Check localStorage
        try {
            refCode = localStorage.getItem(this.STORAGE_KEY);
            if (refCode) {
                // Check if stored timestamp is within 30 days
                const timestamp = localStorage.getItem(`${this.STORAGE_KEY}_timestamp`);
                if (timestamp) {
                    const daysSince = (Date.now() - parseInt(timestamp)) / (1000 * 60 * 60 * 24);
                    if (daysSince <= 30) {
                        return refCode;
                    }
                }
            }
        } catch (e) { }

        return null;
    }

    /**
     * Track referral link click
     * Sends to backend for analytics
     */
    async trackClick(refCode) {
        try {
            await fetch('/api/referral/track-click', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    referral_code: refCode,
                    landing_page: window.location.pathname,
                    user_agent: navigator.userAgent,
                    click_source: this.detectClickSource(),
                    utm_source: new URLSearchParams(window.location.search).get('utm_source'),
                    utm_medium: new URLSearchParams(window.location.search).get('utm_medium'),
                    utm_campaign: new URLSearchParams(window.location.search).get('utm_campaign')
                })
            });
        } catch (error) {
            console.error('Failed to track referral click:', error);
        }
    }

    /**
     * Detect if click came from QR code or link
     */
    detectClickSource() {
        const params = new URLSearchParams(window.location.search);
        if (params.get('source') === 'qr') return 'qr_code';
        if (params.get('qr') === 'true') return 'qr_code';
        return 'link';
    }

    /**
     * Attribute restaurant signup to influencer
     * Call this when restaurant completes signup
     */
    async attributeSignup(restaurantId, restaurantEmail) {
        const refCode = this.getStoredReferralCode();

        if (!refCode) {
            console.log('No referral code found for attribution');
            return { success: false, reason: 'no_referral_code' };
        }

        try {
            const response = await fetch('/api/referral/attribute', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    referral_code: refCode,
                    restaurant_id: restaurantId,
                    restaurant_email: restaurantEmail
                })
            });

            const result = await response.json();

            if (result.success) {
                console.log(`✅ Attributed to influencer: ${result.influencer_name}`);

                // Clear stored referral (one-time use)
                this.clearReferralCode();
            }

            return result;
        } catch (error) {
            console.error('Failed to attribute signup:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Clear all stored referral codes
     */
    clearReferralCode() {
        this.deleteCookie(this.COOKIE_NAME);
        try {
            localStorage.removeItem(this.STORAGE_KEY);
            localStorage.removeItem(`${this.STORAGE_KEY}_timestamp`);
            sessionStorage.removeItem(this.STORAGE_KEY);
        } catch (e) { }
    }

    /**
     * Add referral code to all navigation links
     * Persists ref code through multi-page flows
     */
    persistReferralInLinks() {
        const refCode = this.getStoredReferralCode();
        if (!refCode) return;

        // Find all internal links
        const links = document.querySelectorAll('a[href^="/"], a[href^="./"]');

        links.forEach(link => {
            const url = new URL(link.href, window.location.origin);

            // Don't add if already has ref param
            if (!url.searchParams.has('ref')) {
                url.searchParams.set('ref', refCode);
                link.href = url.toString();
            }
        });
    }

    /**
     * Remove ref parameter from URL for cleaner look
     * Call after storing the code
     */
    cleanURL() {
        if (!window.history.replaceState) return;

        const url = new URL(window.location);
        if (url.searchParams.has('ref') || url.searchParams.has('referral')) {
            url.searchParams.delete('ref');
            url.searchParams.delete('referral');
            window.history.replaceState({}, '', url.toString());
        }
    }

    // ===== Cookie Utilities =====

    setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    }

    getCookie(name) {
        const nameEQ = name + '=';
        const cookies = document.cookie.split(';');

        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.indexOf(nameEQ) === 0) {
                return cookie.substring(nameEQ.length);
            }
        }
        return null;
    }

    deleteCookie(name) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
    }
}

// ===== Initialize on page load =====

// Create global instance
window.referralTracker = new ReferralTracker();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.referralTracker.init();
        window.referralTracker.persistReferralInLinks();
    });
} else {
    window.referralTracker.init();
    window.referralTracker.persistReferralInLinks();
}

// Export for use in other scripts
export default ReferralTracker;

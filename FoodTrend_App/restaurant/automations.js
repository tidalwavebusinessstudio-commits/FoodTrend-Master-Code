/**
 * Automation Event Layer
 * Handles dispatching system events to external webhooks (Mocked)
 */

const EVENTS = {
    GIG_PUBLISHED: 'gig_published',
    GIG_PAUSED: 'gig_paused',
    BOOKING_CONFIRMED: 'booking_confirmed',
    REVIEW_RECEIVED: 'review_received',
    ANNOUNCEMENT_SENT: 'announcement_sent'
};

function emitEvent(eventName, payload) {
    const eventData = {
        event: eventName,
        timestamp: new Date().toISOString(),
        restaurantId: 'mock-rest-id',
        data: payload
    };

    console.group('%c [Automation Event]', 'color: #64ffda; font-weight: bold;');
    console.log('Triggered:', eventName);
    console.log('Payload:', payload);
    console.log('Dispatching to Webhook URL...');
    console.groupEnd();

    // Future: fetch('webhook_url', { method: 'POST', body: JSON.stringify(eventData) })
}

// Global exposure for other scripts
window.emitEvent = emitEvent;

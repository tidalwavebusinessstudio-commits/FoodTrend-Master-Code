/**
 * Gigs Logic
 */

function toggleGigStatus(checkbox) {
    const statusBadge = checkbox.closest('.card').querySelector('.status-badge');

    if (checkbox.checked) {
        statusBadge.textContent = 'Live';
        statusBadge.className = 'status-badge status-active';
        // Trigger Automation Hook
        console.log('Event: gig_published', { gigId: '123' });
    } else {
        statusBadge.textContent = 'Paused';
        statusBadge.className = 'status-badge status-paused';
        console.log('Event: gig_paused', { gigId: '123' });
    }
}

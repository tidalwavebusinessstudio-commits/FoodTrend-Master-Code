/**
 * Calendar Logic
 */

function viewBooking(creator) {
    // Simple view logic for MVP
    const verified = confirm(`Booking Details:\n\nCreator: @${creator}\nParty Size: 2\nStatus: Pending Confirmation\n\nConfirm this booking?`);

    if (verified) {
        alert(`Booking for @${creator} confirmed! Syncing to GHL...`);
        console.log('Event: booking_confirmed', { creator });
    }
}

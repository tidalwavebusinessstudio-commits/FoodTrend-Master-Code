/**
 * Upsell Engine Logic
 */

function openUpsellModal() {
    document.getElementById('upsellModal').style.display = 'block';
}

function closeUpsellModal() {
    document.getElementById('upsellModal').style.display = 'none';
}

function saveUpsell() {
    const btn = document.querySelector('#upsellModal .btn-primary');
    const originalText = btn.textContent;

    btn.textContent = 'Saving...';

    setTimeout(() => {
        btn.textContent = 'Saved!';
        btn.classList.add('btn-outline'); // Visual feedback
        setTimeout(() => {
            closeUpsellModal();
            btn.textContent = originalText;
            btn.classList.remove('btn-outline');
        }, 800);
    }, 500);

    // Tag automation event
    console.log('Event: upsell_config_updated');
}

// Close on outside click
window.onclick = function (event) {
    const modal = document.getElementById('upsellModal');
    if (event.target == modal) {
        closeUpsellModal();
    }
}

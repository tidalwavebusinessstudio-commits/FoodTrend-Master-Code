/**
 * Qualification & ROI Logic
 */

/* State */
let currentStep = 1;
const sliderVideos = document.getElementById('video-slider');
const sliderViews = document.getElementById('views-slider');

/* Navigation */
function nextStep(step) {
    // Hide current
    document.getElementById(`step-${currentStep}`).classList.remove('active');
    // Update bar
    document.getElementById(`progress-${step}`).style.background = 'var(--accent-primary)';
    // Show next
    document.getElementById(`step-${step}`).classList.add('active');
    currentStep = step;

    // Animation reset
    const el = document.getElementById(`step-${step}`);
    el.classList.remove('fade-in');
    void el.offsetWidth; // trigger reflow
    el.classList.add('fade-in');
}

/* Calculator Logic */
function updateCalculations() {
    const videos = parseInt(sliderVideos.value);
    const avgViews = parseInt(sliderViews.value);

    // Math
    const totalViews = videos * avgViews;
    const cpm = 20; // $20 CPM assumed value
    const mediaVal = (totalViews / 1000) * cpm;
    const estReviews = Math.floor(videos * 0.2); // 20% conversion to review

    // Update DOM
    document.getElementById('video-count-val').textContent = videos;
    document.getElementById('views-val').textContent = avgViews.toLocaleString();

    document.getElementById('total-views').textContent = formatNumber(totalViews);
    document.getElementById('media-value').textContent = '$' + formatNumber(Math.round(mediaVal));
    document.getElementById('content-pieces').textContent = videos;
    document.getElementById('google-reviews').textContent = '~' + estReviews;
}

function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toLocaleString();
}

/* Event Listeners */
if (sliderVideos && sliderViews) {
    sliderVideos.addEventListener('input', updateCalculations);
    sliderViews.addEventListener('input', updateCalculations);

    // Initialize
    updateCalculations();
}

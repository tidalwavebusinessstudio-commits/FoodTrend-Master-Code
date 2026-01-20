/**
 * FoodTrend Restaurant Portal
 * Core Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('FoodTrend Restaurant App Initialized');

    // Initialize Utilities
    initAnimations();
});

function initAnimations() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    });

    elements.forEach(el => observer.observe(el));
}

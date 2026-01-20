/**
 * AI Business Consultant
 * Context-aware suggestions engine
 */

const TIPS = [
    {
        type: 'opportunity',
        text: '"You have 4 empty slots on Tuesday! Try boosting your gig visibility."',
        action: 'Boost Now'
    },
    {
        type: 'upsell',
        text: '"Your Upsell attach rate is low (5%). Consider adding a bundle deal."',
        action: 'Edit Upsell'
    },
    {
        type: 'growth',
        text: '"Creators used #BurgerLovers 50 times. Add this tag to your description!"',
        action: 'Update Gig'
    }
];

function initAI() {
    const container = document.querySelector('.sidebar div:last-child'); // Targeting the bottom div
    if (!container) return;

    // Render a random tip
    const tip = TIPS[Math.floor(Math.random() * TIPS.length)];

    container.innerHTML = `
    <div style="font-size: 0.8rem; color: #8892b0; margin-bottom: 5px; display: flex; align-items: center; gap: 6px;">
      <span style="color: #64ffda;">●</span> AI Consultant
    </div>
    <p style="font-size: 0.9rem; margin-bottom: 10px; line-height: 1.4;">${tip.text}</p>
    <button class="btn btn-outline" style="width: 100%; font-size: 0.8rem; padding: 6px;">${tip.action}</button>
  `;
}

// Run on load
document.addEventListener('DOMContentLoaded', initAI);

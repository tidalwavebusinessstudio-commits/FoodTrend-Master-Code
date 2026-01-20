/**
 * Dashboard Logic
 */

/* Mobile Sidebar Toggle */
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('open');
}

/* Chart.js Initialization */
document.addEventListener('DOMContentLoaded', () => {
    const ctx = document.getElementById('momentumChart');

    if (ctx) {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Feb 1', 'Feb 5', 'Feb 10', 'Feb 15', 'Feb 20', 'Feb 25', 'Mar 1'],
                datasets: [{
                    label: 'Total Views',
                    data: [5000, 6200, 7500, 8900, 10500, 11200, 12500],
                    borderColor: '#ffc107', // Amber
                    backgroundColor: 'rgba(255, 193, 7, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        grid: { color: 'rgba(255,255,255,0.05)' },
                        ticks: { color: '#8892b0' }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: '#8892b0' }
                    }
                }
            }
        }); // End Chart
    }
});

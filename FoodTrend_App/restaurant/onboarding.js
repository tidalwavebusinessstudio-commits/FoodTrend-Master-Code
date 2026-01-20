/**
 * Onboarding Wizard Logic
 */

let currentWizardStep = 1;

function nextWizardStep(step) {
    // Hide current
    document.getElementById(`step-${currentWizardStep}`).classList.remove('active');

    // Show next
    document.getElementById(`step-${step}`).classList.add('active');

    // Update indicator
    document.getElementById('step-indicator').textContent = `Step ${step} of 4`;
    currentWizardStep = step;

    // Save data mock (Optional for MVP local storage)
    if (step === 4) {
        saveOnboardingData();
    }
}

function saveOnboardingData() {
    const data = {
        name: document.getElementById('rest-name').value,
        gigTitle: document.getElementById('gig-title').value,
        gigQuota: document.getElementById('gig-quota').value
    };
    console.log('Onboarding Complete:', data);

    // In a real app, this would POST to Supabase/Make
    // For now, we simulate success
}

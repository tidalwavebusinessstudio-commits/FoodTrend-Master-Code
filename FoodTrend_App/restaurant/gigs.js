/**
 * Gigs Logic - Restaurant Dashboard
 * Integrated with Supabase + GHL sync hooks
 */

// ============================================================================
// SUPABASE CONFIG
// ============================================================================
const SUPABASE_URL = 'https://vsgljspzmynbqfyuvyyl.supabase.co';
const SUPABASE_KEY = 'sb_publishable_eH52Wo-WDJ7WkasY4GejOw_b0xUYZ-_';
const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let currentEditingGig = null;
let currentRestaurantId = null;

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', async function () {
    // Get current restaurant from auth
    const { data: { user } } = await db.auth.getUser();
    if (user) {
        // Fetch restaurant ID from profiles or restaurants table
        const { data: restaurant } = await db
            .from('restaurants')
            .select('id')
            .eq('email', user.email)
            .single();

        if (restaurant) {
            currentRestaurantId = restaurant.id;
            await loadGigs();
        }
    }

    // Setup form listener
    const form = document.getElementById('createGigForm');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            createGig();
        });
    }
});

// ============================================================================
// LOAD GIGS FROM SUPABASE
// ============================================================================

async function loadGigs() {
    if (!currentRestaurantId) {
        console.warn('No restaurant ID found');
        return;
    }

    const { data: gigs, error } = await db
        .from('gigs')
        .select('*')
        .eq('restaurant_id', currentRestaurantId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error loading gigs:', error);
        return;
    }

    // Render gigs
    const container = document.getElementById('gig-list-container');

    // Keep static demo gig, add loaded gigs
    if (gigs && gigs.length > 0) {
        gigs.forEach(gig => {
            const card = createGigCard(gig);
            container.insertBefore(card, container.firstChild);
        });
    }

    console.log(`Loaded ${gigs?.length || 0} gigs`);
}

// ============================================================================
// TOGGLE GIG STATUS (PUBLISH/PAUSE)
// ============================================================================

async function toggleGigStatus(checkbox) {
    const card = checkbox.closest('.card');
    const gigId = card.dataset.gigId;
    const statusBadge = card.querySelector('.status-badge');
    const newStatus = checkbox.checked ? 'published' : 'paused';

    // Update UI immediately
    if (checkbox.checked) {
        statusBadge.textContent = 'Live';
        statusBadge.className = 'status-badge status-active';
    } else {
        statusBadge.textContent = 'Paused';
        statusBadge.className = 'status-badge status-paused';
    }

    // If this is a real gig (has ID), update in Supabase
    if (gigId) {
        const updates = {
            status: newStatus,
            updated_at: new Date().toISOString()
        };

        if (newStatus === 'published') {
            updates.published_at = new Date().toISOString();
        }

        const { error } = await db
            .from('gigs')
            .update(updates)
            .eq('id', gigId);

        if (error) {
            console.error('Error updating gig status:', error);
            alert('Failed to update gig status');
            return;
        }

        // Trigger GHL sync when publishing
        if (newStatus === 'published') {
            console.log('Event: gig_published', { gigId });
            // The backend gig-sync.js will handle GHL sync via webhook or API call
            await triggerGHLSync(gigId, 'publish');
        } else {
            console.log('Event: gig_paused', { gigId });
            await triggerGHLSync(gigId, 'pause');
        }
    } else {
        console.log('Demo gig toggle (not persisted)');
    }
}

// ============================================================================
// GHL SYNC TRIGGER
// ============================================================================

async function triggerGHLSync(gigId, action) {
    try {
        // Call backend API to trigger GHL sync
        // This would hit your Express/Node backend that runs gig-sync.js
        const response = await fetch('/api/gigs/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ gigId, action })
        });

        if (response.ok) {
            console.log(`GHL sync triggered for gig ${gigId}: ${action}`);
        } else {
            console.warn('GHL sync API not available (may need backend deployment)');
        }
    } catch (error) {
        // API not available - log but don't block
        console.warn('GHL sync skipped (backend not running):', error.message);
    }
}

// ============================================================================
// CREATE GIG
// ============================================================================

async function createGig() {
    const gigData = {
        restaurant_id: currentRestaurantId,
        title: document.getElementById('gigTitle').value,
        description: document.getElementById('gigDescription').value,
        daily_slots: parseInt(document.getElementById('gigSlots').value) || 2,
        status: 'draft'
    };

    // Save to Supabase if we have a restaurant ID
    let savedGig = gigData;
    if (currentRestaurantId) {
        const { data, error } = await db
            .from('gigs')
            .insert([gigData])
            .select()
            .single();

        if (error) {
            console.error('Error creating gig:', error);
            alert('Failed to create gig. Please try again.');
            return;
        }

        savedGig = data;
        console.log('Gig saved to Supabase:', savedGig.id);
    } else {
        // Demo mode - generate fake ID
        savedGig.id = 'demo-' + Date.now();
        console.log('Demo mode: gig not saved to database');
    }

    // Add new gig card to the list
    const gigListContainer = document.getElementById('gig-list-container');
    const newGigCard = createGigCard(savedGig);
    gigListContainer.insertBefore(newGigCard, gigListContainer.firstChild);

    // Close modal and show success
    closeCreateGigModal();
    alert('✅ Gig created! Toggle the switch to make it Live and notify influencers.');
}

function openCreateGigModal() {
    document.getElementById('createGigModal').style.display = 'block';
}

function closeCreateGigModal() {
    document.getElementById('createGigModal').style.display = 'none';
    document.getElementById('createGigForm').reset();
}

// ============================================================================
// CREATE GIG CARD DOM
// ============================================================================

function createGigCard(gig) {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.marginBottom = '20px';
    card.dataset.gigId = gig.id; // Store gig ID for updates
    card.dataset.gigTitle = gig.title;
    card.dataset.gigDescription = gig.description;
    card.dataset.gigSlots = gig.daily_slots || gig.dailySlots;

    const isLive = gig.status === 'published';
    const statusClass = isLive ? 'status-active' : 'status-draft';
    const statusText = isLive ? 'Live' : 'Draft';

    card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 20px;">
            <div style="flex: 1; min-width: 300px;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                    <h3 style="margin: 0;" class="gig-title">${escapeHtml(gig.title)}</h3>
                    <span class="status-badge ${statusClass}">${statusText}</span>
                </div>
                <p class="text-secondary gig-description" style="margin-bottom: 15px;">
                    ${escapeHtml(gig.description)}
                </p>
                <div style="display: flex; gap: 10px;">
                    <div class="text-muted" style="font-size: 0.9rem;">📍 0/${gig.daily_slots || gig.dailySlots || 2} slots booked today</div>
                </div>
            </div>

            <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 15px;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span class="text-muted" style="font-size: 0.9rem;">Global Visibility</span>
                    <label class="switch">
                        <input type="checkbox" ${isLive ? 'checked' : ''} onchange="toggleGigStatus(this)">
                        <span class="slider"></span>
                    </label>
                </div>

                <div style="display: flex; gap: 10px;">
                    <button class="btn btn-outline" onclick="openUpsellModal()">Manage Upsells</button>
                    <button class="btn btn-outline" onclick="openEditGigModal(this)">Edit Gig</button>
                </div>
            </div>
        </div>
    `;

    return card;
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================================================
// EDIT GIG MODAL
// ============================================================================

function openEditGigModal(btn) {
    const card = btn.closest('.card');
    currentEditingGig = card;

    const title = card.querySelector('.gig-title')?.textContent || card.dataset.gigTitle || '';
    const description = card.querySelector('.gig-description')?.textContent.trim() || card.dataset.gigDescription || '';

    document.getElementById('editGigTitle').value = title;
    document.getElementById('editGigDescription').value = description;

    document.getElementById('editGigModal').style.display = 'block';
}

function closeEditGigModal() {
    document.getElementById('editGigModal').style.display = 'none';
    currentEditingGig = null;
}

async function saveGigEdit() {
    if (!currentEditingGig) return;

    const newTitle = document.getElementById('editGigTitle').value;
    const newDescription = document.getElementById('editGigDescription').value;
    const gigId = currentEditingGig.dataset.gigId;

    // Update in Supabase if real gig
    if (gigId && !gigId.startsWith('demo-')) {
        const { error } = await db
            .from('gigs')
            .update({
                title: newTitle,
                description: newDescription,
                updated_at: new Date().toISOString()
            })
            .eq('id', gigId);

        if (error) {
            console.error('Error updating gig:', error);
            alert('Failed to update gig');
            return;
        }

        // Trigger GHL sync for update
        await triggerGHLSync(gigId, 'update');
    }

    // Update the card UI
    const titleEl = currentEditingGig.querySelector('.gig-title');
    const descEl = currentEditingGig.querySelector('.gig-description');

    if (titleEl) titleEl.textContent = newTitle;
    if (descEl) descEl.textContent = newDescription;

    currentEditingGig.dataset.gigTitle = newTitle;
    currentEditingGig.dataset.gigDescription = newDescription;

    closeEditGigModal();
    alert('✅ Gig updated!');
}

// ============================================================================
// UPSELL MODAL
// ============================================================================

function openUpsellModal() {
    document.getElementById('upsellModal').style.display = 'block';
}

function closeUpsellModal() {
    document.getElementById('upsellModal').style.display = 'none';
}

function saveUpsell() {
    alert('✅ Upsell settings saved!');
    closeUpsellModal();
}

// ============================================================================
// MODAL CLOSE ON OUTSIDE CLICK
// ============================================================================

window.onclick = function (event) {
    if (event.target.className === 'modal') {
        event.target.style.display = 'none';
    }
}

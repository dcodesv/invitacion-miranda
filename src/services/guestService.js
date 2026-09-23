import { INITIAL_GUESTS } from '../data/initialGuests';

const STORAGE_KEY = 'cumple_invitaciones_guests_v2';
const ALPHANUMERIC_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

// Generate a random unique 6-character alphanumeric code
export function generateUniqueCode(existingGuests = []) {
  const usedCodes = new Set(
    existingGuests.map(g => (g.code || '').toUpperCase())
  );

  let newCode = '';
  do {
    newCode = '';
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * ALPHANUMERIC_CHARS.length);
      newCode += ALPHANUMERIC_CHARS[randomIndex];
    }
  } while (usedCodes.has(newCode));

  return newCode;
}

// Get all guests with automatic reconciliation of INITIAL_GUESTS
export function getGuests() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_GUESTS));
    return INITIAL_GUESTS;
  }

  try {
    const storedGuests = JSON.parse(data);
    if (!Array.isArray(storedGuests)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_GUESTS));
      return INITIAL_GUESTS;
    }

    // Map stored guests by id
    const storedMap = new Map(storedGuests.map(g => [g.id, g]));
    let hasChanges = false;
    const updatedList = [...storedGuests];

    // Reconcile each initial guest entry
    INITIAL_GUESTS.forEach(initial => {
      const existing = storedMap.get(initial.id);
      if (!existing) {
        // New initial guest added to code! Append to list
        updatedList.push({ ...initial });
        hasChanges = true;
      } else {
        // Check if code, name or definition in INITIAL_GUESTS changed
        if (existing.code !== initial.code || existing.name !== initial.name) {
          const idx = updatedList.findIndex(g => g.id === initial.id);
          if (idx !== -1) {
            updatedList[idx] = {
              ...existing,
              code: initial.code,
              name: initial.name,
              // Preserve user's RSVP response if already responded
              status: existing.status !== 'pending' ? existing.status : (initial.status || existing.status),
              attendingPasses: existing.status !== 'pending' ? existing.attendingPasses : (initial.attendingPasses || existing.attendingPasses)
            };
            hasChanges = true;
          }
        }
      }
    });

    if (hasChanges) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    }

    return updatedList;
  } catch (e) {
    console.error("Failed to parse guests storage, resetting...", e);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_GUESTS));
    return INITIAL_GUESTS;
  }
}

// Save guests array
export function saveGuests(guests) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(guests));
  window.dispatchEvent(new Event('guests_updated'));
}

// Find single guest by code/slug (case-insensitive)
export function getGuestByCode(code) {
  if (!code) return null;
  const guests = getGuests();
  const normalized = code.trim().toUpperCase();
  return guests.find(g => (g.code || '').toUpperCase() === normalized || (g.id || '').toUpperCase() === normalized) || null;
}

// Update RSVP status for guest
export function updateGuestRsvp(code, status, attendingPasses, notes) {
  const guests = getGuests();
  const normalized = code.trim().toUpperCase();
  const index = guests.findIndex(g => (g.code || '').toUpperCase() === normalized || (g.id || '').toUpperCase() === normalized);

  if (index === -1) return false;

  guests[index] = {
    ...guests[index],
    status, // 'confirmed' | 'declined' | 'pending'
    attendingPasses: status === 'confirmed' ? Math.min(attendingPasses, guests[index].passes) : 0,
    notes: notes || '',
    updatedAt: new Date().toISOString()
  };

  saveGuests(guests);
  return guests[index];
}

// Add new guest with unique 6-character random alphanumeric code
export function addGuest(newGuest) {
  const guests = getGuests();
  const code = (newGuest.code && newGuest.code.trim())
    ? newGuest.code.trim().toUpperCase()
    : generateUniqueCode(guests);

  const guestToAdd = {
    id: 'guest-' + Date.now().toString().slice(-6),
    code: code,
    name: newGuest.name,
    passes: Number(newGuest.passes) || 1,
    status: 'pending',
    attendingPasses: Number(newGuest.passes) || 1,
    notes: '',
    updatedAt: null
  };

  guests.push(guestToAdd);
  saveGuests(guests);
  return guestToAdd;
}

// Update existing guest definition (by admin)
export function updateGuestByAdmin(id, updatedFields) {
  const guests = getGuests();
  const index = guests.findIndex(g => g.id === id);
  if (index === -1) return false;

  guests[index] = {
    ...guests[index],
    ...updatedFields,
    code: updatedFields.code ? updatedFields.code.trim().toUpperCase() : guests[index].code,
    passes: Number(updatedFields.passes) || guests[index].passes,
    updatedAt: new Date().toISOString()
  };

  saveGuests(guests);
  return guests[index];
}

// Delete guest
export function deleteGuest(id) {
  const guests = getGuests();
  const filtered = guests.filter(g => g.id !== id);
  saveGuests(filtered);
  return true;
}

// Reset data to initial list
export function resetGuestsData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_GUESTS));
  window.dispatchEvent(new Event('guests_updated'));
  return INITIAL_GUESTS;
}

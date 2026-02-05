/**
 * Utility functions for database operations
 */

const API_BASE = 'https://detox7pro-production.up.railway.app';

/**
 * Save a generated password to the database
 */
export async function savePassword(password, options = {}) {
    const response = await fetch(`${API_BASE}/save-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            password_text: password,
            category: options.category || 'general',
            length: options.length || 16,
            uses_uppercase: options.uses_uppercase !== false,
            uses_lowercase: options.uses_lowercase !== false,
            uses_numbers: options.uses_numbers !== false,
            uses_special: options.uses_special !== false,
        }),
    });

    if (!response.ok) {
        throw new Error(`Failed to save password: ${response.statusText}`);
    }

    return response.json();
}

/**
 * Get all saved passwords for the current user
 */
export async function getPasswords() {
    const response = await fetch(`${API_BASE}/get-passwords`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch passwords: ${response.statusText}`);
    }

    return response.json();
}

/**
 * Delete a saved password
 */
export async function deletePassword(passwordId) {
    const response = await fetch(`${API_BASE}/delete-password/${passwordId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to delete password: ${response.statusText}`);
    }

    return response.json();
}

/**
 * Update password category or notes
 */
export async function updatePassword(passwordId, updates) {
    const response = await fetch(`${API_BASE}/update-password/${passwordId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
    });

    if (!response.ok) {
        throw new Error(`Failed to update password: ${response.statusText}`);
    }

    return response.json();
}

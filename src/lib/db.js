/**
 * Utility functions for database operations
 */

/**
 * Save a generated password to the database
 * @param {string} password - The password text to save
 * @param {object} options - Password generation options
 * @returns {Promise<object>} Saved password object
 */
export async function savePassword(password, options = {}) {
    const response = await fetch('/api/save-password', {
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
 * @returns {Promise<array>} Array of saved passwords
 */
export async function getPasswords() {
    const response = await fetch('/api/get-passwords', {
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
 * @param {number} passwordId - The ID of the password to delete
 * @returns {Promise<object>} Response object
 */
export async function deletePassword(passwordId) {
    const response = await fetch(`/api/delete-password/${passwordId}`, {
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
 * @param {number} passwordId - The ID of the password to update
 * @param {object} updates - Object with fields to update
 * @returns {Promise<object>} Updated password object
 */
export async function updatePassword(passwordId, updates) {
    const response = await fetch(`/api/update-password/${passwordId}`, {
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

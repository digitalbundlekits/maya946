import { Preferences } from '@capacitor/preferences';

/**
 * Save user login session to Capacitor Preferences and localStorage.
 *
 * @param {string} userId - The user's ID.
 * @param {string} sessionId - The session ID to save.
 */
export const setLoginSession = async (userId, sessionId) => {
    try {
        if (!userId || !sessionId) {
            throw new Error('Invalid parameters. Both userId and sessionId are required.');
        }

        // Save to Capacitor Preferences
        await Preferences.set({ key: 'user_id', value: userId });
        await Preferences.set({ key: 'session_id', value: sessionId });

        // Save to localStorage
        localStorage.setItem('user_id', userId);
        localStorage.setItem('session_id', sessionId);

        console.log('Login session saved successfully:', { userId, sessionId });
    } catch (error) {
        console.error('Error saving login session:', error.message);
        throw error;
    }
};

/**
 * Retrieve user login session from Capacitor Preferences and fallback to localStorage if needed.
 *
 * @returns {Promise<{ userId: string | null, sessionId: string | null }>} - The stored user ID and session ID.
 */
export const getLoginSession = async () => {
    try {
        // Attempt to retrieve from Capacitor Preferences
        const userIdPref = await Preferences.get({ key: 'user_id' });
        const sessionIdPref = await Preferences.get({ key: 'session_id' });

        // Fallback to localStorage if Preferences returns null
        const userId = userIdPref.value || localStorage.getItem('user_id');
        const sessionId = sessionIdPref.value || localStorage.getItem('session_id');

        console.log('Retrieved login session:', { userId, sessionId });
        return { userId, sessionId };
    } catch (error) {
        console.error('Error retrieving login session:', error.message);
        return { userId: null, sessionId: null }; // Return null values if an error occurs
    }
};

/**
 * Clear user login session from Capacitor Preferences and localStorage.
 */
export const clearLoginSession = async () => {
    try {
        // Remove from Capacitor Preferences
        await Preferences.remove({ key: 'user_id' });
        await Preferences.remove({ key: 'session_id' });

        // Remove from localStorage
        localStorage.removeItem('user_id');
        localStorage.removeItem('session_id');

        console.log('Login session cleared successfully.');
    } catch (error) {
        console.error('Error clearing login session:', error.message);
    }
};

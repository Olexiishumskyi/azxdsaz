/**
 * @file Handles communication with the Make.com webhook (AI service).
 */
import { updateApiStatus } from '../ui/state.js';

// TODO: Replace with your actual Make.com webhook URL
const MAKE_WEBHOOK_URL = 'https://hook.eu1.make.com/your-webhook-id'; // IMPORTANT: User must replace this

/**
 * Sends the user's thought to the AI service via a Make.com webhook.
 * @param {string} thought - The negative thought string from the user.
 * @returns {Promise<object>} A promise that resolves with the AI's structured response.
 * @throws {Error} If the request fails or the response is not ok.
 */
export async function sendThoughtToAI(thought) {
    if (!thought || typeof thought !== 'string' || thought.trim() === '') {
        throw new Error("Thought cannot be empty.");
    }

    if (MAKE_WEBHOOK_URL.includes('your-webhook-id') || MAKE_WEBHOOK_URL.includes('example.com')) {
        console.warn("Using placeholder MAKE_WEBHOOK_URL. Please update it in scripts/services/api.js.");
        // Potentially throw an error or return a specific mock response to prevent actual calls to placeholder.
        // For now, we'll let it try and likely fail, which will be caught by the caller.
    }

    console.log(`[API Service] Sending thought to AI: "${thought}"`);
    updateApiStatus('Sending thought to AI...', 'loading');

    try {
        const response = await fetch(MAKE_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ thought: thought.trim() }),
        });

        console.log('[API Service] Raw response received:', response);

        if (!response.ok) {
            let errorData;
            try {
                errorData = await response.json();
                console.error('[API Service] Error response data:', errorData);
            } catch (e) {
                // If response is not JSON or empty
                console.error('[API Service] Could not parse error response as JSON:', e);
                errorData = { message: `Server responded with status: ${response.status}` };
            }
            const errorMessage = errorData?.message || `HTTP error ${response.status} - ${response.statusText}`;
            updateApiStatus(`Error: ${errorMessage}`, 'error');
            throw new Error(errorMessage);
        }

        const data = await response.json();
        console.log('[API Service] Parsed AI response data:', data);

        // Basic validation of expected response structure
        if (!data || typeof data.distortions === 'undefined' || typeof data.alternative === 'undefined' || typeof data.encouragement === 'undefined') {
            updateApiStatus('Error: Invalid data structure from AI.', 'error');
            throw new Error('Received malformed data from AI service. Expected "distortions", "alternative", and "encouragement" fields.');
        }

        updateApiStatus('AI response received successfully.', 'success');
        return data;

    } catch (error) {
        console.error('[API Service] Fetch error:', error);
        // Ensure status is updated even for network errors not caught by response.ok
        if (!(error instanceof Error && error.message.startsWith('HTTP error'))) { // Avoid double update for HTTP errors
           updateApiStatus(`Network/Request Error: ${error.message}`, 'error');
        }
        // Re-throw the error to be handled by the calling function (e.g., in form.js)
        // This ensures the UI can display a user-friendly message.
        throw error;
    }
}

console.info("services/api.js loaded");

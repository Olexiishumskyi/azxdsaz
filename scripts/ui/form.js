/**
 * @file Manages the thought input form, submission, and interaction with API services.
 */
import { qs, on } from '../utils/helpers.js';
import { setLoadingState, showErrorMessage, clearErrorMessage, updateApiStatus, updateCharCounter } from './state.js';
import { renderAIResponse, clearResponseDisplay, renderRawJsonResponse } from './render.js';
import { sendThoughtToAI } from '../services/api.js';
import { mockSendThoughtToAI } from '../services/mock.js';

// DOM Elements
const natForm = qs('#natForm');
const natTextInput = qs('#natText');
const mockApiToggle = qs('#mockApiToggle'); // In developer tools
const aiResponseSection = qs('#aiResponseSection');

const MAX_THOUGHT_LENGTH = 500;

let currentThoughtData = null; // To store the latest thought and its AI response for journaling

/**
 * Initializes the NAT form, setting up event listeners.
 */
export function initNatForm() {
    if (!natForm || !natTextInput) {
        console.error("NAT form or text input not found. Form functionality will be disabled.");
        return;
    }

    on(natForm, 'submit', handleSubmit);
    on(natTextInput, 'input', () => {
        updateCharCounter(natTextInput, MAX_THOUGHT_LENGTH);
        // Optionally clear previous results when user starts typing a new thought
        if (aiResponseSection && aiResponseSection.style.display !== 'none') {
            // clearResponseDisplay(); // Decided against auto-clear for now, can be distracting. User can submit again.
        }
    });
    // Initialize char counter
    updateCharCounter(natTextInput, MAX_THOUGHT_LENGTH);
}

/**
 * Handles the submission of the NAT form.
 * @param {Event} event - The form submission event.
 */
async function handleSubmit(event) {
    event.preventDefault();
    clearErrorMessage(); // Clear previous errors
    clearResponseDisplay(); // Clear previous results before new submission

    const thought = natTextInput.value.trim();

    if (!thought) {
        showErrorMessage("Please enter your negative thought before submitting.");
        natTextInput.focus();
        return;
    }

    if (thought.length > MAX_THOUGHT_LENGTH) {
        showErrorMessage(`Thought is too long. Please keep it under ${MAX_THOUGHT_LENGTH} characters. Current: ${thought.length}`);
        natTextInput.focus();
        return;
    }

    setLoadingState(true, "Analyzing your thought...");

    try {
        let aiResponse;
        const useMock = mockApiToggle && mockApiToggle.checked;

        console.log(`Submitting thought. Using mock API: ${useMock}`);
        updateApiStatus(useMock ? 'Using Mock API' : 'Using Real API', 'loading');

        if (useMock) {
            aiResponse = await mockSendThoughtToAI(thought);
        } else {
            aiResponse = await sendThoughtToAI(thought);
        }

        console.log("AI Response received in form.js:", aiResponse);
        renderRawJsonResponse(aiResponse); // Show raw JSON in dev panel

        // Basic validation of the AI response structure, even if service layer did some.
        if (!aiResponse || typeof aiResponse.distortions === 'undefined' || typeof aiResponse.alternative === 'undefined' || typeof aiResponse.encouragement === 'undefined') {
            throw new Error('Received incomplete or malformed data from the AI service.');
        }

        renderAIResponse(aiResponse);
        updateApiStatus('Successfully processed thought.', 'success');

        // Store data for potential journaling
        currentThoughtData = {
            originalThought: thought,
            analysis: aiResponse,
            timestamp: new Date().toISOString()
        };
        // console.log("Current thought data for journal:", currentThoughtData);


    } catch (error) {
        console.error("Error during thought processing:", error);
        showErrorMessage(`Failed to get analysis: ${error.message}`);
        updateApiStatus(`Error: ${error.message}`, 'error');
        renderRawJsonResponse({ error: error.message, stack: error.stack }); // Show error in dev panel
    } finally {
        setLoadingState(false);
    }
}

/**
 * Gets the current thought data (original thought + AI analysis).
 * Used for journaling.
 * @returns {object|null} The current thought data or null.
 */
export function getCurrentThoughtData() {
    return currentThoughtData;
}


console.info("ui/form.js loaded");

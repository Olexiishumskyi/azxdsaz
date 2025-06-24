/**
 * @file Manages UI state, including loading indicators, error messages, and status updates.
 */
import { qs } from '../utils/helpers.js';

// DOM Elements related to state
const submitButton = qs('#submitNatButton');
const submitSpinner = qs('#submitSpinner'); // Spinner on the submit button
const loadingIndicator = qs('#loadingIndicator'); // General loading section for AI response
const errorMessageDiv = qs('#errorMessage');
const apiStatusText = qs('#apiStatusText'); // In developer tools
const natForm = qs('#natForm');
const charCounterElement = qs('#charCounter');

// App state (could be expanded if needed)
let isLoading = false;

/**
 * Sets the application's loading state.
 * @param {boolean} loading - True if loading, false otherwise.
 * @param {string} [message='Analyzing your thought...'] - Optional message for general loading indicator.
 */
export function setLoadingState(loading, message = 'Analyzing your thought...') {
    isLoading = loading;

    if (submitButton) {
        const buttonText = submitButton.querySelector('.button-text');
        if (loading) {
            if (buttonText) buttonText.textContent = 'Processing...';
            if (submitSpinner) submitSpinner.style.display = 'inline-block';
            submitButton.disabled = true;
            natForm.classList.add('form-submitting');
        } else {
            if (buttonText) buttonText.textContent = 'Reframe My Thought';
            if (submitSpinner) submitSpinner.style.display = 'none';
            submitButton.disabled = false;
            natForm.classList.remove('form-submitting');
        }
    }

    if (loadingIndicator) {
        const loadingMessageEl = loadingIndicator.querySelector('p');
        if (loadingMessageEl) loadingMessageEl.textContent = message;
        loadingIndicator.style.display = loading ? 'block' : 'none';
    }

    // If loading, hide any previous error messages
    if (loading) {
        clearErrorMessage();
    }
}

/**
 * Displays an error message in the UI.
 * @param {string} message - The error message to display.
 */
export function showErrorMessage(message) {
    if (errorMessageDiv) {
        errorMessageDiv.textContent = message;
        errorMessageDiv.style.display = 'block';
        errorMessageDiv.setAttribute('aria-hidden', 'false');
    }
    updateApiStatus(`Error: ${message.substring(0, 50)}...`, 'error'); // Update dev status
}

/**
 * Clears any displayed error messages.
 */
export function clearErrorMessage() {
    if (errorMessageDiv) {
        errorMessageDiv.textContent = '';
        errorMessageDiv.style.display = 'none';
        errorMessageDiv.setAttribute('aria-hidden', 'true');
    }
}

/**
 * Updates the API status indicator in the developer tools.
 * @param {string} statusMessage - The message to display.
 * @param {'idle'|'loading'|'success'|'error'} type - The type of status.
 */
export function updateApiStatus(statusMessage, type = 'idle') {
    if (apiStatusText) {
        apiStatusText.textContent = statusMessage;
        const statusIndicatorDiv = apiStatusText.closest('.status-indicator');
        if (statusIndicatorDiv) {
            statusIndicatorDiv.className = 'status-indicator'; // Reset classes
            statusIndicatorDiv.classList.add(`status-${type}`);
        }
    }
}

/**
 * Gets the current loading state.
 * @returns {boolean} True if the application is currently loading.
 */
export function getLoadingState() {
    return isLoading;
}

/**
 * Updates the character counter for a textarea.
 * @param {HTMLTextAreaElement} textareaElement - The textarea element.
 * @param {number} maxLength - The maximum allowed characters.
 */
export function updateCharCounter(textareaElement, maxLength) {
    if (!charCounterElement || !textareaElement) return;
    const currentLength = textareaElement.value.length;
    charCounterElement.textContent = `${currentLength} / ${maxLength}`;
    if (currentLength > maxLength) {
        charCounterElement.classList.add('limit-exceeded');
    } else {
        charCounterElement.classList.remove('limit-exceeded');
    }
}


console.info("ui/state.js loaded");

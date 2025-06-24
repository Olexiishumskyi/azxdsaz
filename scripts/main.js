/**
 * @file Main entry point for the AI Cognitive Reframe Tool application.
 */
import { qs, on } from './utils/helpers.js';
import { initNatForm, getCurrentThoughtData } from './ui/form.js';
import { updateBeliefRatingDisplay, clearResponseDisplay } from './ui/render.js';
import { updateApiStatus, showErrorMessage, clearErrorMessage, updateCharCounter } from './ui/state.js'; // Assuming clearErrorMessage might be useful globally

// DOM Elements for general interaction
const beliefRatingInput = qs('#beliefRating');
const natTextInput = qs('#natText'); // Also used in form.js, but needed here for clearing
const mockApiToggle = qs('#mockApiToggle');
const devToolsPanel = qs('#devToolsPanel');
const toggleDevToolsButton = qs('#toggleDevToolsButton');
const saveJournalButton = qs('#saveJournalButton'); // For future journal functionality

// Configuration
const MAX_THOUGHT_LENGTH_MAIN = 500; // Consistent with form.js

/**
 * Initializes the application.
 * Sets up global event listeners and initializes modules.
 */
functioninitializeApp() {
    console.log("Initializing MindShift AI Application...");

    // Initialize the main thought input form
    initNatForm();

    // Event listener for the belief rating slider
    if (beliefRatingInput) {
        on(beliefRatingInput, 'input', updateBeliefRatingDisplay);
        // Initialize display
        updateBeliefRatingDisplay();
    }

    // Event listener for the mock API toggle
    if (mockApiToggle) {
        on(mockApiToggle, 'change', handleMockApiToggleChange);
        // Set initial API status based on toggle's default state (if any, or just idle)
        updateApiStatus(mockApiToggle.checked ? 'Mock API Enabled' : 'Real API Active', mockApiToggle.checked ? 'success' : 'idle');
    }

    // Event listener for toggling developer tools
    if (toggleDevToolsButton && devToolsPanel) {
        on(toggleDevToolsButton, 'click', () => {
            const isHidden = devToolsPanel.style.display === 'none' || devToolsPanel.style.display === '';
            devToolsPanel.style.display = isHidden ? 'block' : 'none';
            toggleDevToolsButton.textContent = isHidden ? 'Hide Developer Tools' : 'Show Developer Tools';
        });
    }

    // Event listener for the "Save to Journal" button (Phase 4 feature)
    if (saveJournalButton) {
        on(saveJournalButton, 'click', handleSaveToJournal);
    }

    // Example: Clear button (if we wanted one)
    // const clearButton = qs('#clearAllButton'); // Assuming such a button exists
    // if (clearButton) {
    //     on(clearButton, 'click', () => {
    //         if (natTextInput) natTextInput.value = '';
    //         updateCharCounter(natTextInput, MAX_THOUGHT_LENGTH_MAIN);
    //         clearResponseDisplay();
    //         clearErrorMessage();
    //         updateApiStatus('Cleared.', 'idle');
    //     });
    // }


    console.log("Application Initialized.");
    // Initial status update
    // updateApiStatus("Application Idle.", "idle"); // already handled by mock toggle usually
}

/**
 * Handles the change event of the mock API toggle.
 */
function handleMockApiToggleChange() {
    if (mockApiToggle) {
        const isMockEnabled = mockApiToggle.checked;
        updateApiStatus(isMockEnabled ? 'Mock API Enabled' : 'Real API Active', isMockEnabled ? 'success' : 'idle');
        console.log(`Mock API Toggled: ${isMockEnabled ? 'ON' : 'OFF'}`);
        // Potentially clear results or notify user if a request is in flight? For now, simple status update.
    }
}

/**
 * Handles saving the current thought and its analysis to local storage (Journal).
 * This is a Phase 4 feature.
 */
function handleSaveToJournal() {
    const thoughtData = getCurrentThoughtData();
    const beliefRating = beliefRatingInput ? beliefRatingInput.value : null;

    if (!thoughtData) {
        showErrorMessage("No analysis data to save. Please submit a thought first.");
        return;
    }

    const journalEntry = {
        ...thoughtData,
        beliefRating: beliefRating,
        savedAt: new Date().toISOString()
    };

    try {
        let journal = JSON.parse(localStorage.getItem('cbtJournal')) || [];
        journal.unshift(journalEntry); // Add to the beginning of the array
        localStorage.setItem('cbtJournal', JSON.stringify(journal));

        // Provide feedback to the user
        // This could be a more sophisticated notification later
        if(saveJournalButton) {
            const originalText = saveJournalButton.textContent;
            saveJournalButton.textContent = 'Saved!';
            saveJournalButton.disabled = true;
            setTimeout(() => {
                saveJournalButton.textContent = originalText;
                saveJournalButton.disabled = false;
            }, 2000);
        }
        console.log("Entry saved to journal:", journalEntry);
        updateApiStatus("Entry saved to journal.", "success");

    } catch (error) {
        console.error("Error saving to journal:", error);
        showErrorMessage("Could not save entry to journal. Local storage might be full or disabled.");
        updateApiStatus("Error saving to journal.", "error");
    }
}


// Start the application once the DOM is fully loaded
on(window, 'DOMContentLoaded', initializeApp);

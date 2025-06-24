/**
 * @file Handles rendering data to the DOM.
 */
import { qs, escapeHTML } from '../utils/helpers.js';

// DOM element references for displaying AI response
const aiResponseSection = qs('#aiResponseSection');
const analysisResultsDiv = qs('#analysisResults'); // Parent of specific result blocks
const distortionsList = qs('#distortionsList');
const noDistortionsP = qs('#noDistortions');
const alternativeTextP = qs('#alternativeText');
const encouragementTextP = qs('#encouragementText');

// DOM element references for believability section
const believabilitySection = qs('#believabilitySection');
const beliefRatingInput = qs('#beliefRating');
const beliefRatingValueSpan = qs('#beliefRatingValue');
const saveJournalButton = qs('#saveJournalButton'); // Will be shown when results are displayed

// DOM element for Developer Tools raw JSON output
const rawJsonResponsePre = qs('#rawJsonResponse');

// Placeholder for distortion descriptions (could be fetched or defined elsewhere)
const distortionDescriptions = {
    "Catastrophizing": "Exaggerating the potential negative consequences of a situation, imagining the worst-case scenario.",
    "Mind Reading": "Assuming you know what others are thinking, often negatively, without concrete evidence.",
    "Overgeneralization": "Drawing broad conclusions based on a single event or piece of evidence.",
    "Labeling": "Assigning global, negative traits to yourself or others based on specific behaviors or events.",
    "Emotional Reasoning": "Believing something is true because it 'feels' true, ignoring or discounting evidence to the contrary.",
    "Should Statements": "Having rigid rules about how you or others 'should' behave, leading to guilt or resentment.",
    "Personalization": "Taking responsibility or blame for events that are not entirely within your control.",
    "Filtering": "Focusing on the negative details while ignoring the positive ones.",
    "All-or-Nothing Thinking": "Seeing things in black-and-white categories, with no middle ground.",
    "Discounting the Positive": "Rejecting positive experiences by insisting they 'don't count' for some reason."
    // Add more as needed
};

/**
 * Renders the AI's analysis results to the DOM.
 * @param {object} aiData - The structured data from the AI.
 * @param {string[]} aiData.distortions - Array of identified cognitive distortions.
 * @param {string} aiData.alternative - The rational alternative thought.
 * @param {string} aiData.encouragement - The encouragement message.
 */
export function renderAIResponse({ distortions, alternative, encouragement }) {
    if (!aiResponseSection || !analysisResultsDiv) {
        console.error("AI Response section or analysis results div not found in DOM.");
        return;
    }

    renderDistortions(distortions);
    if (alternativeTextP) alternativeTextP.innerHTML = escapeHTML(alternative).replace(/\n/g, '<br>'); // Use innerHTML for <br>
    if (encouragementTextP) encouragementTextP.innerHTML = escapeHTML(encouragement).replace(/\n/g, '<br>');

    analysisResultsDiv.style.display = 'block';
    aiResponseSection.style.display = 'block'; // Ensure the main section is visible

    // Show believability section now that there's a response
    if (believabilitySection) believabilitySection.style.display = 'block';
    if (saveJournalButton) saveJournalButton.style.display = 'inline-block'; // Or 'block' depending on layout
}

/**
 * Renders the list of cognitive distortions.
 * @param {string[]} distortionsArray - Array of distortion names.
 */
function renderDistortions(distortionsArray) {
    if (!distortionsList || !noDistortionsP) return;

    distortionsList.innerHTML = ''; // Clear previous distortions

    if (distortionsArray && distortionsArray.length > 0) {
        distortionsArray.forEach(distortionName => {
            const li = document.createElement('li');
            const strong = document.createElement('strong');
            strong.textContent = escapeHTML(distortionName);
            li.appendChild(strong);

            const description = distortionDescriptions[distortionName] || "No specific description available.";
            const span = document.createElement('span');
            span.textContent = `: ${escapeHTML(description)}`;
            li.appendChild(span);

            distortionsList.appendChild(li);
        });
        distortionsList.style.display = 'block';
        noDistortionsP.style.display = 'none';
    } else {
        distortionsList.style.display = 'none';
        noDistortionsP.style.display = 'block';
        noDistortionsP.textContent = "No specific cognitive distortions were identified, or this might be a general negative feeling. The alternative thought and encouragement can still be helpful!";
    }
}

/**
 * Clears the AI response display from the DOM.
 */
export function clearResponseDisplay() {
    if (distortionsList) distortionsList.innerHTML = '';
    if (alternativeTextP) alternativeTextP.textContent = '';
    if (encouragementTextP) encouragementTextP.textContent = '';
    if (noDistortionsP) noDistortionsP.style.display = 'none';

    if (analysisResultsDiv) analysisResultsDiv.style.display = 'none';
    if (aiResponseSection) aiResponseSection.style.display = 'none';
    if (believabilitySection) believabilitySection.style.display = 'none';
    if (saveJournalButton) saveJournalButton.style.display = 'none';

    // Also clear raw JSON if it was displayed
    if (rawJsonResponsePre) rawJsonResponsePre.textContent = '';
}

/**
 * Updates the displayed value of the belief rating slider.
 */
export function updateBeliefRatingDisplay() {
    if (beliefRatingInput && beliefRatingValueSpan) {
        beliefRatingValueSpan.textContent = beliefRatingInput.value;
    }
}

/**
 * Renders the raw JSON response in the developer tools panel.
 * @param {object} jsonData - The JSON data to display.
 */
export function renderRawJsonResponse(jsonData) {
    if (rawJsonResponsePre) {
        try {
            rawJsonResponsePre.textContent = JSON.stringify(jsonData, null, 2);
        } catch (e) {
            rawJsonResponsePre.textContent = "Error stringifying JSON response.";
            console.error("Error stringifying JSON for dev panel:", e);
        }
    }
}

console.info("ui/render.js loaded");

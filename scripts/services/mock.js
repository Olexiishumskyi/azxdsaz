/**
 * @file Mock API service for testing purposes.
 */
import { updateApiStatus } from '../ui/state.js';

const MOCK_DELAY = 1200; // Simulate network latency in milliseconds

const mockResponses = [
    {
        distortions: ["Catastrophizing", "Mind Reading"],
        alternative: "It's possible I'm misinterpreting the situation. Maybe they are just busy, or perhaps my presentation wasn't as bad as I think. I can ask for specific feedback.",
        encouragement: "You've handled challenging situations before and have the strength to navigate this one too. Focus on what you can control and learn from the experience."
    },
    {
        distortions: ["Overgeneralization", "Labeling"],
        alternative: "One mistake doesn't define my entire capability. Everyone makes errors sometimes. I can learn from this and improve next time.",
        encouragement: "Be kind to yourself. This is a learning opportunity, not a final judgment on your worth or skills."
    },
    {
        distortions: ["Emotional Reasoning"],
        alternative: "Just because I feel like a failure doesn't mean I am one. Feelings are not always facts. I should look at the objective evidence.",
        encouragement: "Your feelings are valid, but they don't always reflect the whole truth. Take a moment to breathe and look at the situation from a different perspective."
    },
    {
        distortions: ["Should Statements"],
        alternative: "Instead of focusing on what I 'should' have done, I can focus on what I can do now or differently in the future. Holding myself to rigid expectations can be unhelpful.",
        encouragement: "Perfection is an illusion. It's okay to be imperfect. Focus on progress, not perfection."
    },
    {
        distortions: [], // No specific distortion
        alternative: "This is a tough situation, and it's okay to feel overwhelmed. I can break it down into smaller, manageable steps.",
        encouragement: "You're resilient and capable. Take it one step at a time. You don't have to solve everything at once."
    }
];

/**
 * Simulates sending the user's thought to an AI service.
 * @param {string} thought - The negative thought string from the user.
 * @returns {Promise<object>} A promise that resolves with a mock AI's structured response.
 * @throws {Error} If the mock service is configured to simulate an error.
 */
export async function mockSendThoughtToAI(thought) {
    console.log(`[Mock API] Received thought: "${thought}"`);
    updateApiStatus('Processing with Mock AI...', 'loading');

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (thought.toLowerCase().includes("mockerror")) {
                console.warn('[Mock API] Simulating an error response.');
                updateApiStatus('Error: Mock AI simulation failed.', 'error');
                reject(new Error("Mock API Error: Simulated server failure."));
                return;
            }

            if (thought.toLowerCase().includes("mockmalformed")) {
                console.warn('[Mock API] Simulating a malformed response.');
                updateApiStatus('Error: Mock AI returned malformed data.', 'error');
                resolve({
                    // Missing 'alternative' and 'encouragement'
                    distortions: ["Partial Data"],
                });
                return;
            }

            // Select a random response or cycle through them
            const randomIndex = Math.floor(Math.random() * mockResponses.length);
            const response = JSON.parse(JSON.stringify(mockResponses[randomIndex])); // Deep copy

            // Slightly customize response based on thought length for variability
            if (thought.length > 50) {
                response.encouragement += " That was a long thought, good job articulating it!";
            } else {
                response.encouragement += " Keep exploring your thoughts!";
            }

            console.log('[Mock API] Sending mock response:', response);
            updateApiStatus('Mock AI response received.', 'success');
            resolve(response);
        }, MOCK_DELAY);
    });
}

console.info("services/mock.js loaded");

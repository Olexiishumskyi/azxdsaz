/**
 * @file Utility helper functions for DOM manipulation and other common tasks.
 */

/**
 * Queries the DOM for a single element.
 * @param {string} selector - The CSS selector to search for.
 * @param {Document|Element} [scope=document] - The scope to search within.
 * @returns {Element|null} The first matching element or null if not found.
 */
export function qs(selector, scope = document) {
    if (!selector) throw new Error("Selector cannot be empty for qs.");
    return scope.querySelector(selector);
}

/**
 * Queries the DOM for multiple elements.
 * @param {string} selector - The CSS selector to search for.
 * @param {Document|Element} [scope=document] - The scope to search within.
 * @returns {NodeListOf<Element>} A NodeList containing all matching elements.
 */
export function qsa(selector, scope = document) {
    if (!selector) throw new Error("Selector cannot be empty for qsa.");
    return scope.querySelectorAll(selector);
}

/**
 * Adds an event listener to an element.
 * @param {EventTarget} target - The target element to attach the event listener to.
 * @param {string} type - The event type (e.g., 'click').
 * @param {Function} callback - The function to call when the event occurs.
 * @param {boolean|AddEventListenerOptions} [options] - Optional event listener options.
 * @returns {Function} A function to remove the event listener.
 */
export function on(target, type, callback, options = false) {
    if (!target) {
        console.warn(`Attempted to add event listener to a null target for event type "${type}".`);
        return () => {}; // Return a no-op function
    }
    target.addEventListener(type, callback, options);
    return () => {
        target.removeEventListener(type, callback, options);
    };
}

/**
 * Debounces a function, ensuring it's only called after a certain period of inactivity.
 * @param {Function} func - The function to debounce.
 * @param {number} delay - The debounce delay in milliseconds.
 * @returns {Function} The debounced function.
 */
export function debounce(func, delay = 250) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

/**
 * Basic HTML escaping.
 * @param {string} str - The string to escape.
 * @returns {string} The escaped string.
 */
export function escapeHTML(str) {
    if (typeof str !== 'string') return '';
    return str.replace(/[&<>"']/g, function (match) {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[match];
    });
}

// Example of a simple logger if more advanced logging is needed later.
// export const logger = {
//     debug: (...args) => console.debug('[DEBUG]', ...args),
//     info: (...args) => console.info('[INFO]', ...args),
//     warn: (...args) => console.warn('[WARN]', ...args),
//     error: (...args) => console.error('[ERROR]', ...args),
// };

console.info("helpers.js loaded");

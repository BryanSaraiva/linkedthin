/**
 * LinkedThin
 * Filters out promotional and irrelevant content from the LinkedIn feed based on specific keywords.
 */

const BLOCKED_KEYWORDS = [
    "Suggested",
    "Recommended for you",
    "Promoted",
    "Principals you might know",
    "Job recommendation",
    "People you might know",
    "Check out these profiles",
    "Because you viewed",
    "Follow",
    "Sort by:" // Guard clause: included here to handle specific edge cases in processPost
];

/**
 * Evaluates a single feed item and toggles visibility based on content criteria.
 * @param {HTMLElement} postElement - The DOM node representing a feed card.
 */
const processPost = (postElement) => {
    // Idempotency check: prevent re-evaluating nodes that have already been processed
    // to reduce main thread blocking during scroll events.
    if (postElement.dataset.linkedThinProcessed) return;
    postElement.dataset.linkedThinProcessed = "true";

    const rawText = postElement.innerText;

    // Determine if the post contains any blocked keywords.
    // Simple string inclusion is used over Regex to account for unpredictable
    // DOM text concatenation in the host application.
    const shouldHide = BLOCKED_KEYWORDS.some(keyword => rawText.includes(keyword));

    if (shouldHide) {
        // Edge Case Handling: The sorting toolbar shares similar DOM attributes/text keywords.
        // We ensure we don't hide the toolbar by checking content length.
        if (rawText.includes("Sort by:") && rawText.length < 100) {
            return; 
        }
        
        // Hide the element visually but retain it in the DOM.
        // This ensures we do not break the host site's infinite scroll measurements.
        postElement.style.display = "none";
        postElement.classList.add('linked-thin-hidden'); 
    }
};

/**
 * Queries the DOM for feed items using stable analytics attributes.
 */
const scanFeed = () => {
    // Using 'data-view-tracking-scope' as it is a required attribute for the host's analytics,
    // making it less likely to change than CSS class names.
    const posts = document.querySelectorAll('div[data-view-tracking-scope]');
    posts.forEach(processPost);
};

// Throttle DOM scanning to prevent performance degradation during rapid scrolling.
let timeout = null;
const observer = new MutationObserver(() => {
    if (timeout) return;
    timeout = setTimeout(() => {
        scanFeed();
        timeout = null;
    }, 500);
});

// Observe the entire body to catch dynamic content loading (Infinite Scroll).
observer.observe(document.body, {
    childList: true,
    subtree: true
});

// Initial execution delayed to ensure the host SPA has fully hydrated the initial view.
setTimeout(() => {
    scanFeed();
}, 1000);
# LinkedThin

**LinkedThin** is a lightweight Firefox extension designed to refine the LinkedIn feed by removing promotional, suggested, and irrelevant content. It targets specific analytics attributes to ensure stability across platform updates.

## Why LinkedThin?

LinkedIn often populates the user feed with "Suggested" or "Recommended" posts that distract from primary network updates. LinkedThin identifies these elements via stable tracking attributes and suppresses them visually without interfering with the platform's core pagination logic.

## Technical Implementation

* MutationObserver: Monitors the DOM for dynamically injected feed items during infinite scroll events.
* Idempotency: Implements data-attribute flagging to ensure each node is processed only once, maintaining high performance.
* Visual Suppression: Uses display: none rather than DOM removal to avoid breaking the host site's scroll height calculations.

## Installation

LinkedThin is available via the official Firefox Add-ons gallery. 

1. Visit the LinkedThin extension page on the Firefox Add-ons website.
2. Click the Add to Firefox button.
3. Confirm the permissions when prompted to begin refining your feed immediately.

## Privacy

LinkedThin runs entirely locally. It does not track user behaviour or communicate with external servers.
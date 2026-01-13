// This file is often blocked by ad-blockers.
// We use a generic name and defensive exports to prevent the app from crashing.
export function tryPlausible(msg) {
	try {
		if (typeof self !== 'undefined' && self.plausible) {
			self.plausible(msg);
		}
	} catch (e) {
		// Silently ignore tracking errors
	}
}
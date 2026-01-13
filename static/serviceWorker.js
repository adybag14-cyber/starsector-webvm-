// Service Worker gutted to prevent interference with development.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", () => {
    self.registration.unregister();
    self.clients.claim();
});
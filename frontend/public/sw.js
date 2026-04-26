/* Minimal no-op service worker. Stops 404s on GET /sw.js from old installs or tooling.
   No fetch handler: pages load from the network as usual. */
self.addEventListener("install", () => {
  self.skipWaiting()
})
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim())
})

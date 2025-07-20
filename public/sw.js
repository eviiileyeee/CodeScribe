self.addEventListener("install", () => {
  console.log("Service Worker installed.");
});

self.addEventListener("fetch", (event) => {
  // Can cache resources here
});

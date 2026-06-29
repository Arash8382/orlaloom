// Orla Loom — push notification service worker (self-hosted Web Push)
self.addEventListener("push", (event) => {
  let d = {};
  try { d = event.data ? event.data.json() : {}; } catch (e) { d = { body: event.data && event.data.text() }; }
  const title = d.title || "Orla Loom 🌿";
  const options = {
    body: d.body || "A new cottagecore find just landed.",
    icon: "/icon.svg",
    badge: "/icon.svg",
    tag: d.tag || "orlaloom-new",
    data: { url: d.url || "https://www.orlaloom.com" },
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || "https://www.orlaloom.com";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      for (const c of list) { if (c.url === url && "focus" in c) return c.focus(); }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});

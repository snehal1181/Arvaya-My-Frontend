// Import Firebase scripts
importScripts("https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js");

// Initialize Firebase with new project credentials
firebase.initializeApp({
  apiKey: "AIzaSyBj6S9NDTwliQXF74jZ-a6FReHhTNLa6dk",
  authDomain: "arvaya-d841e.firebaseapp.com",
  projectId: "arvaya-d841e",
  storageBucket: "arvaya-d841e.firebasestorage.app",
  messagingSenderId: "577574167930",
  appId: "1:577574167930:web:2c70d1e2a988922976a2c3",
  measurementId: "G-HQ0NNY7WY6"
});

// Initialize messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Background message received:', payload);

  const notificationTitle = payload.notification?.title || "Notification";
  const notificationOptions = {
    body: payload.notification?.body,
    icon: '/assets/arvaya-logo.png',
    tag: 'Arvaya'
  };

  // Show notification
  self.registration.showNotification(notificationTitle, notificationOptions);

  // Post payload to open clients (tabs)
  self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'NEW_NOTIFICATION',
        payload: payload.notification
      });
    });
  });
});

// Handle push event (manual FCM payloads)
self.addEventListener("push", (event) => {
  const data = event.data?.json()?.notification || {};
  const title = data.title || "No title";

  const options = {
    body: data.body,
    icon: '/assets/arvaya-logo.png',
    tag: 'Arvaya',
    sound: 'default'
  };

  // Always show popup
  event.waitUntil(
    self.registration.showNotification(title, options)
  );

  // Notify open tabs
  event.waitUntil(
    self.clients.matchAll({ includeUncontrolled: true, type: 'window' }).then(clients => {
      clients.forEach(client => {
        client.postMessage({
          type: 'NEW_NOTIFICATION',
          payload: data
        });
      });
    })
  );
});

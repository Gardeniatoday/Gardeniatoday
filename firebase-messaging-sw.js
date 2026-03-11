// ══════════════════════════════════════════════════════════════════
//  🔥 Firebase Messaging Service Worker
//  ✅ Firebase project: latestgardeniatodayapp
// ══════════════════════════════════════════════════════════════════

importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');

function swLog(msg, isError = false) {
  const time = new Date().toISOString().substring(11, 23);
  const prefix = isError ? '❌ [SW]' : '🔧 [SW]';
  if (isError) console.error(`${prefix} ${time} — ${msg}`);
  else         console.log (`${prefix} ${time} — ${msg}`);
}

swLog('Firebase SW بدأ التحميل...');

// ✅ نفس الـ config بالظبط الموجود في firebase-init.js
const firebaseConfig = {
  apiKey:            "AIzaSyCKKnkAg5kj0fgcbjSXqYjqXfF_RS4ZlGg",
  authDomain:        "latestgardeniatodayapp.firebaseapp.com",
  projectId:         "latestgardeniatodayapp",
  storageBucket:     "latestgardeniatodayapp.firebasestorage.app",
  messagingSenderId: "669309172822",
  appId:             "1:669309172822:web:5b19431fc2669131698ff7",
  measurementId:     "G-3KWDVEXK0M"
};

let messaging;
try {
  firebase.initializeApp(firebaseConfig);
  messaging = firebase.messaging();
  swLog('✅ Firebase initialized — project: ' + firebaseConfig.projectId);
} catch (err) {
  swLog('فشل تهيئة Firebase: ' + err.message, true);
}

// ══════════════════════════════════════════════════════════════════
//  Background Messages (التطبيق في الخلفية أو مغلق)
// ══════════════════════════════════════════════════════════════════
if (messaging) {
  messaging.onBackgroundMessage((payload) => {
    swLog('📱 رسالة في الخلفية — title: ' + payload.notification?.title);

    const title   = payload.notification?.title || 'جاردينيا توداي';
    const options = {
      body:               payload.notification?.body || 'لديك إشعار جديد',
      icon:               '/Gardeniatoday/icons/Icon-192.png',
      badge:              '/Gardeniatoday/icons/Icon-192.png',
      data:               payload.data || {},
      requireInteraction: true,
      vibrate:            [200, 100, 200],
      tag:                'gardenia-notif',
      renotify:           true,
    };

    return self.registration.showNotification(title, options);
  });
  swLog('✅ onBackgroundMessage listener مسجّل');
}

// ══════════════════════════════════════════════════════════════════
//  Notification Click
// ══════════════════════════════════════════════════════════════════
self.addEventListener('notificationclick', (event) => {
  swLog('🔔 ضغط على الإشعار');
  event.notification.close();

  const targetUrl = event.notification.data?.url
                 || 'https://gardeniatoday.github.io/Gardeniatoday/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes('/Gardeniatoday/') && 'focus' in client) {
            return client.focus();
          }
        }
        return clients.openWindow(targetUrl);
      })
  );
});

self.addEventListener('notificationclose', () => {
  swLog('🔕 المستخدم أغلق الإشعار');
});

// ══════════════════════════════════════════════════════════════════
//  SW Lifecycle
// ══════════════════════════════════════════════════════════════════
self.addEventListener('install', (event) => {
  swLog('⚙️ install');
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  swLog('⚡ activate');
  event.waitUntil(self.clients.claim());
});

// ✅ لا نتدخل في fetch — نتركه لـ Flutter
self.addEventListener('fetch', () => {});

// ══════════════════════════════════════════════════════════════════
//  Push Fallback
// ══════════════════════════════════════════════════════════════════
self.addEventListener('push', (event) => {
  swLog('📨 push event وصل');
  if (!event.data) return;

  let payload;
  try {
    payload = event.data.json();
  } catch (e) {
    swLog('خطأ في parse الـ payload', true);
    return;
  }

  const title = payload?.notification?.title || payload?.data?.title || 'جاردينيا توداي';
  const body  = payload?.notification?.body  || payload?.data?.body  || 'لديك إشعار جديد';

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon:  '/Gardeniatoday/icons/Icon-192.png',
      badge: '/Gardeniatoday/icons/Icon-192.png',
      data:  payload?.data || {},
      tag:   'gardenia-push-fallback',
    })
  );
});

swLog('✅ firebase-messaging-sw.js جاهز — project: ' + firebaseConfig.projectId);
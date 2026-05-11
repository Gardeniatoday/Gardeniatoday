// web/Gardeniatoday/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

// ✅ استخدم بيانات المشروع الشغال
firebase.initializeApp({
  apiKey: "AIzaSyCKKnkAg5kj0fgcbjSXqYjqXfF_RS4ZlGg",
  authDomain: "latestgardeniatodayapp.firebaseapp.com",
  projectId: "latestgardeniatodayapp",
  storageBucket: "latestgardeniatodayapp.firebasestorage.app",
  messagingSenderId: "669309172822",
  appId: "1:669309172822:web:5b19431fc2669131698ff7",
  measurementId: "G-3KWDVEXK0M"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('📨 Background message:', payload);

  return self.registration.showNotification(
    payload.notification?.title || 'جاردينيا توداي',
    {
      body: payload.notification?.body || 'إشعار جديد',
      icon: '/Gardeniatoday/icons/Icon-192.png',
      badge: '/Gardeniatoday/icons/Icon-192.png',
      data: payload.data
    }
  );
});

console.log('✅ Firebase SW loaded');
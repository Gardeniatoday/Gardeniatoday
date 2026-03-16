const LOG_PREFIX = "[Main JS]";

function log(msg, obj) {
  console.log(LOG_PREFIX, msg, obj || "");
}

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyCKKnkAg5kj0fgcbjSXqYjqXfF_RS4ZlGg",
    authDomain: "latestgardeniatodayapp.firebaseapp.com",
    projectId: "latestgardeniatodayapp",
    storageBucket: "latestgardeniatodayapp.firebasestorage.app",
    messagingSenderId: "669309172822",
    appId: "1:669309172822:web:5b19431fc2669131698ff7",
    measurementId: "G-3KWDVEXK0M"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

log("Firebase initialized");

document.getElementById("subscribeBtn").addEventListener("click", async () => {
  try {
    // طلب الإذن
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      alert("تم رفض الإشعارات!");
      return;
    }

    // تسجيل الـ Service Worker
    const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
    log("SW registered", registration);

    // انتظر حتى يصبح الـ Service Worker نشطًا
    await waitForServiceWorkerActivation(registration);

    // الحصول على FCM token
    const token = await messaging.getToken({
      vapidKey: "BDMCuyIBNSOFBGKIipKVIojndaNOSEzur2VuRoZvZLCOrjVHSCYW0Jely7sqD855qz9AWOy-uGjW6QTtrYYWgnA",
      serviceWorkerRegistration: registration
    });

    log("FCM Token", token);
    alert("تم الاشتراك بنجاح! تحقق من console للـ token");

  } catch (err) {
    console.error(LOG_PREFIX, "خطأ في الاشتراك:", err);
    alert("حدث خطأ أثناء الاشتراك في الإشعارات، تحقق من console");
  }
});

// دالة مساعدة للانتظار حتى يتم تفعيل Service Worker
function waitForServiceWorkerActivation(registration) {
  return new Promise((resolve) => {
    if (registration.active) {
      resolve();
      return;
    }

    // انتظر حتى يصبح الـ Service Worker نشطًا
    const sw = registration.installing || registration.waiting;
    if (sw) {
      sw.addEventListener('statechange', () => {
        if (sw.state === 'activated') {
          resolve();
        }
      });
    } else {
      // إذا لم يكن هناك Service Worker قيد التثبيت، انتظر قليلاً وحاول مرة أخرى
      setTimeout(resolve, 1000);
    }
  });
}
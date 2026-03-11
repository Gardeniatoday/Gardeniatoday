// ══════════════════════════════════════════════════════════════════
//  🔥 firebase-init.js
//  ✅ Firebase project: latestgardeniatodayapp
//  ⚠️ لازم يكون نفس الـ config في firebase-messaging-sw.js
// ══════════════════════════════════════════════════════════════════

import { initializeApp }  from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAnalytics }   from "https://www.gstatic.com/firebasejs/10.14.1/firebase-analytics.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging.js";

// ✅ نفس الـ config بالظبط الموجود في firebase-messaging-sw.js
const firebaseConfig = {
  apiKey:            "AIzaSyCKKnkAg5kj0fgcbjSXqYjqXfF_RS4ZlGg",
  authDomain:        "latestgardeniatodayapp.firebaseapp.com",
  projectId:         "latestgardeniatodayapp",
  storageBucket:     "latestgardeniatodayapp.firebasestorage.app",
  messagingSenderId: "669309172822",
  appId:             "1:669309172822:web:5b19431fc2669131698ff7",
  measurementId:     "G-3KWDVEXK0M"
};

const app       = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const messaging = getMessaging(app);

console.log('✅ [firebase-init] Firebase initialized — project:', firebaseConfig.projectId);
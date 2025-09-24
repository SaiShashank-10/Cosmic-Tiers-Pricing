// Firebase client initialization
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBcoxCESlgst2HTU6T3qHBfKF5t5yhbP-4",
  authDomain: "fir-hatch-signup-b7f75.firebaseapp.com",
  projectId: "fir-hatch-signup-b7f75",
  storageBucket: "fir-hatch-signup-b7f75.firebasestorage.app",
  messagingSenderId: "359412084221",
  appId: "1:359412084221:web:ff35ac3e31b6758c0f3d94",
  measurementId: "G-G14WFBZR0Y"
};

// Initialize Firebase app (guard to avoid multiple in dev HMR)
let app;
try {
  app = initializeApp(firebaseConfig);
} catch (err) {
  // initializeApp will throw if already initialized in some environments; ignore
  // eslint-disable-next-line no-console
  console.warn('Firebase app init warning:', err);
}

const auth = getAuth(app as any);

export { auth };


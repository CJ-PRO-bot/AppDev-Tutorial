import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

const config = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Firebase is optional: a zero-setup guest mode is always available.
export const firebaseEnabled = Boolean(config.apiKey && config.projectId && config.appId);
export let auth: Auth | null = null;
export let db: Firestore | null = null;

if (firebaseEnabled) {
  const app = getApps().length ? getApp() : initializeApp(config);
  try {
    auth = Platform.OS === 'web'
      ? getAuth(app)
      : initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
  } catch (error) {
    // Fast refresh may leave an initialized Firebase Auth instance.
    auth = getAuth(app);
  }
  db = getFirestore(app);
}

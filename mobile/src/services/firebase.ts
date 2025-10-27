import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import Constants from 'expo-constants';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.firebaseApiKey || process.env.FIREBASE_API_KEY,
  authDomain: Constants.expoConfig?.extra?.firebaseAuthDomain || process.env.FIREBASE_AUTH_DOMAIN,
  projectId: Constants.expoConfig?.extra?.firebaseProjectId || process.env.FIREBASE_PROJECT_ID,
  storageBucket: Constants.expoConfig?.extra?.firebaseStorageBucket || process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: Constants.expoConfig?.extra?.firebaseMessagingSenderId || process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: Constants.expoConfig?.extra?.firebaseAppId || process.env.FIREBASE_APP_ID,
  measurementId: Constants.expoConfig?.extra?.firebaseMeasurementId || process.env.FIREBASE_MEASUREMENT_ID,
};

// Check if Firebase config is valid
const isFirebaseConfigured = firebaseConfig.apiKey && firebaseConfig.projectId && 
  firebaseConfig.apiKey !== 'undefined' && firebaseConfig.projectId !== 'undefined';

console.log('🔥 Firebase Configuration Status:', isFirebaseConfigured ? 'Configured' : 'Not Configured');

// Initialize Firebase only once
if (!firebase.apps.length) {
  if (isFirebaseConfigured) {
    firebase.initializeApp(firebaseConfig);
    console.log('✅ Firebase initialized successfully');
  } else {
    console.warn('⚠️  Firebase not configured. Please set up your .env file.');
    console.warn('⚠️  App will run in demo mode without authentication.');
    // Initialize with dummy config for development
    firebase.initializeApp({
      apiKey: 'AIzaSyDemoKey-DoNotUseInProduction',
      authDomain: 'demo.firebaseapp.com',
      projectId: 'demo-project-id',
      storageBucket: 'demo.appspot.com',
      messagingSenderId: '123456789',
      appId: '1:123456789:web:abc123def456',
    });
  }
}

// Export Firebase services
export const auth = firebase.auth();
export const db = firebase.firestore();

// Configure Firestore settings for React Native
try {
  db.settings({
    cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED,
  });
  console.log('✅ Firestore cache configured');
} catch (error) {
  console.warn('⚠️  Firestore settings already configured');
}

// Disable persistence to avoid AsyncStorage issues on React Native
auth.setPersistence(firebase.auth.Auth.Persistence.NONE).catch((error) => {
  console.warn('⚠️  Could not disable Firebase Auth persistence:', error);
});

console.log('✅ Firebase Auth ready (persistence disabled)');
console.log('✅ Firestore ready');
console.log('');
console.log('📌 ÖNEMLI: Firebase Console\'da Firestore Database oluşturmanız gerekiyor!');
console.log('   1. https://console.firebase.google.com adresine gidin');
console.log('   2. "route-project-ad117" projesini seçin');
console.log('   3. Build > Firestore Database > Create database tıklayın');
console.log('   4. Test mode\'da başlatın (geliştirme için)');
console.log('');

export default firebase;

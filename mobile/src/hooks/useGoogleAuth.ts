/**
 * Google Authentication Hook
 * Handles Google Sign-In with Firebase using Expo Auth Session
 */

import { useState, useEffect } from 'react';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { GoogleAuthProvider, signInWithCredential as firebaseSignInWithCredential } from '@firebase/auth';
import { auth, db } from '../services/firebase';
import Constants from 'expo-constants';

// Complete auth sessions for web browser
WebBrowser.maybeCompleteAuthSession();

// Google OAuth Client IDs from environment
const GOOGLE_WEB_CLIENT_ID = Constants.expoConfig?.extra?.googleWebClientId || process.env.GOOGLE_WEB_CLIENT_ID;
const GOOGLE_IOS_CLIENT_ID = Constants.expoConfig?.extra?.googleIosClientId || process.env.GOOGLE_IOS_CLIENT_ID;
const GOOGLE_ANDROID_CLIENT_ID = Constants.expoConfig?.extra?.googleAndroidClientId || process.env.GOOGLE_ANDROID_CLIENT_ID;

export const useGoogleAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Configure Google Auth Request - iOS Client ID as main clientId for Expo Go
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: GOOGLE_IOS_CLIENT_ID,  // iOS Client ID - redirect URI gerekmez
    iosClientId: GOOGLE_IOS_CLIENT_ID,
    androidClientId: GOOGLE_ANDROID_CLIENT_ID,
    webClientId: GOOGLE_WEB_CLIENT_ID,
  });

  // Handle Google OAuth response
  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      handleGoogleSignIn(id_token);
    } else if (response?.type === 'error') {
      console.error('❌ Google OAuth error:', response.error);
      setError('Google ile giriş başarısız oldu.');
      setLoading(false);
    } else if (response?.type === 'cancel') {
      console.log('⚠️ Google sign-in cancelled by user');
      setError(null);
      setLoading(false);
    }
  }, [response]);

  // Sign in to Firebase with Google ID token
  const handleGoogleSignIn = async (idToken: string) => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔵 Creating Firebase credential with Google ID token...');
      
      // Create Firebase credential with Google ID token
      const credential = GoogleAuthProvider.credential(idToken);
      
      // Sign in to Firebase with the credential
      const result = await firebaseSignInWithCredential(auth, credential);
      
      console.log('✅ Google Sign-In successful:', result.user.email);
      
      // Firestore'da kullanıcı var mı kontrol et
      const userDoc = await db.collection('users').doc(result.user.uid).get();
      
      if (!userDoc.exists) {
        // Yeni kullanıcı - Firestore'a kaydet
        console.log('🆕 New user - creating Firestore document');
        
        const userData = {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          emailVerified: result.user.emailVerified,
          provider: 'google',
          createdAt: new Date(),
        };
        
        await db.collection('users').doc(result.user.uid).set(userData);
        console.log('✅ User document created in Firestore');
      } else {
        console.log('✅ Existing user - logged in');
      }
      
      setLoading(false);
    } catch (err: any) {
      console.error('❌ Firebase Google Sign-In error:', err);
      
      let errorMessage = 'Google ile giriş başarısız oldu.';
      
      if (err.code === 'auth/account-exists-with-different-credential') {
        errorMessage = 'Bu e-posta adresi farklı bir yöntemle kullanılıyor.';
      } else if (err.code === 'auth/invalid-credential') {
        errorMessage = 'Google kimlik doğrulama geçersiz.';
      } else if (err.code === 'auth/network-request-failed') {
        errorMessage = 'İnternet bağlantınızı kontrol edin.';
      } else if (err.message?.includes('unavailable') || err.message?.includes('offline')) {
        errorMessage = '⚠️ Firestore bağlantısı yok.\n\nFirebase Console\'da Firestore Database oluşturun.';
      }
      
      setError(errorMessage);
      setLoading(false);
    }
  };

  // Trigger Google sign-in prompt
  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔵 Opening Google sign-in prompt...');
      await promptAsync();
    } catch (err: any) {
      console.error('❌ Google prompt error:', err);
      setError('Google giriş ekranı açılamadı.');
      setLoading(false);
    }
  };

  return {
    signInWithGoogle,
    loading,
    error,
    disabled: !request, // Disable button if request is not ready
  };
};

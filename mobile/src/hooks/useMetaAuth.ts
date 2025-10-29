/**
 * Meta (Facebook) Authentication Hook
 * Handles Facebook Login with Firebase using Expo Auth Session
 */

import { useState, useEffect } from 'react';
import * as Facebook from 'expo-auth-session/providers/facebook';
import * as WebBrowser from 'expo-web-browser';
import { FacebookAuthProvider, signInWithCredential as firebaseSignInWithCredential } from '@firebase/auth';
import { auth, db } from '../services/firebase';
import Constants from 'expo-constants';

// Complete auth sessions for web browser
WebBrowser.maybeCompleteAuthSession();

// Facebook App ID from environment
const META_APP_ID = Constants.expoConfig?.extra?.metaAppId || process.env.META_APP_ID;

export const useMetaAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Configure Facebook Auth Request
  const [request, response, promptAsync] = Facebook.useAuthRequest({
    clientId: META_APP_ID,
  });

  // Handle Facebook OAuth response
  useEffect(() => {
    if (response?.type === 'success') {
      const { access_token } = response.params;
      handleFacebookSignIn(access_token);
    } else if (response?.type === 'error') {
      console.error('❌ Facebook OAuth error:', response.error);
      setError('Meta ile giriş başarısız oldu.');
      setLoading(false);
    } else if (response?.type === 'cancel') {
      console.log('⚠️ Facebook sign-in cancelled by user');
      setError(null);
      setLoading(false);
    }
  }, [response]);

  // Sign in to Firebase with Facebook access token
  const handleFacebookSignIn = async (accessToken: string) => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔵 Creating Firebase credential with Facebook access token...');
      
      // Create Firebase credential with Facebook access token
      const credential = FacebookAuthProvider.credential(accessToken);
      
      // Sign in to Firebase with the credential
      const result = await firebaseSignInWithCredential(auth, credential);
      
      console.log('✅ Facebook Sign-In successful:', result.user.email);
      
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
          provider: 'facebook',
          createdAt: new Date(),
        };
        
        await db.collection('users').doc(result.user.uid).set(userData);
        console.log('✅ User document created in Firestore');
      } else {
        console.log('✅ Existing user - logged in');
      }
      
      setLoading(false);
    } catch (err: any) {
      console.error('❌ Firebase Facebook Sign-In error:', err);
      
      let errorMessage = 'Meta ile giriş başarısız oldu.';
      
      if (err.code === 'auth/account-exists-with-different-credential') {
        errorMessage = 'Bu e-posta adresi farklı bir yöntemle kullanılıyor.\n\nLütfen başka bir giriş yöntemi deneyin.';
      } else if (err.code === 'auth/invalid-credential') {
        errorMessage = 'Meta kimlik doğrulama geçersiz.';
      } else if (err.code === 'auth/network-request-failed') {
        errorMessage = 'İnternet bağlantınızı kontrol edin.';
      } else if (err.code === 'auth/operation-not-allowed') {
        errorMessage = 'Facebook girişi şu anda devre dışı.\n\nFirebase Console\'dan aktifleştirin.';
      } else if (err.message?.includes('unavailable') || err.message?.includes('offline')) {
        errorMessage = '⚠️ Firestore bağlantısı yok.\n\nFirebase Console\'da Firestore Database oluşturun.';
      }
      
      setError(errorMessage);
      setLoading(false);
    }
  };

  // Trigger Facebook sign-in prompt
  const signInWithMeta = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔵 Opening Facebook sign-in prompt...');
      await promptAsync();
    } catch (err: any) {
      console.error('❌ Facebook prompt error:', err);
      setError('Meta giriş ekranı açılamadı.');
      setLoading(false);
    }
  };

  return {
    signInWithMeta,
    loading,
    error,
    disabled: !request, // Disable button if request is not ready
  };
};

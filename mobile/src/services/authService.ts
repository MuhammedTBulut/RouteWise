/**
 * Authentication Service
 * Handles all authentication operations with Firebase
 * Supports email/password, Google, and Meta (Facebook) sign-in
 */

import * as WebBrowser from 'expo-web-browser';
import { auth, db } from './firebase';
import { User } from '../types/auth';
import firebase from 'firebase/app';

// Web browser için gerekli
WebBrowser.maybeCompleteAuthSession();

/**
 * Sign up with email and password
 */
export const signUpWithEmail = async (
  email: string,
  password: string,
  displayName: string
) => {
  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    
    // Update profile with display name
    await userCredential.user?.updateProfile({ displayName });
    
    // Create user document in Firestore
    const userData: User = {
      uid: userCredential.user!.uid,
      email: userCredential.user!.email,
      displayName,
      photoURL: null,
      emailVerified: false,
      provider: 'email',
      createdAt: new Date(),
    };
    
    await db.collection('users').doc(userCredential.user!.uid).set(userData);
    
    return userCredential;
  } catch (error: any) {
    throw new Error(error.message || 'Sign up failed');
  }
};

/**
 * Sign in with email and password
 */
export const signInWithEmail = async (
  email: string,
  password: string
): Promise<User> => {
  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    
    // Get user data from Firestore
    const userDoc = await db.collection('users').doc(userCredential.user!.uid).get();
    
    if (userDoc.exists) {
      return userDoc.data() as User;
    }
    
    // If user document doesn't exist, create one
    const userData: User = {
      uid: userCredential.user!.uid,
      email: userCredential.user!.email,
      displayName: userCredential.user!.displayName,
      photoURL: userCredential.user!.photoURL,
      emailVerified: userCredential.user!.emailVerified,
      provider: 'email',
      createdAt: new Date(),
    };
    
    await db.collection('users').doc(userCredential.user!.uid).set(userData);
    
    return userData;
  } catch (error: any) {
    throw new Error(error.message || 'Sign in failed');
  }
};

/**
 * Sign in with Google using Firebase credential
 * This method expects an ID token from Google OAuth
 */
export const signInWithGoogleCredential = async (idToken: string): Promise<User> => {
  try {
    console.log('🔵 Signing in with Google credential...');
    
    // Create Firebase credential from Google ID token
    const credential = firebase.auth.GoogleAuthProvider.credential(idToken);
    
    // Sign in with credential
    const userCredential = await auth.signInWithCredential(credential);
    
    if (!userCredential.user) {
      throw new Error('Google authentication failed - no user returned');
    }
    
    console.log('✅ Google authentication successful');
    
    // Check if user exists in Firestore
    const userDoc = await db.collection('users').doc(userCredential.user.uid).get();
    
    let userData: User;
    
    if (userDoc.exists) {
      userData = userDoc.data() as User;
      console.log('✅ Existing user loaded from Firestore');
    } else {
      // Create new user
      userData = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName,
        photoURL: userCredential.user.photoURL,
        emailVerified: userCredential.user.emailVerified,
        provider: 'google',
        createdAt: new Date(),
      };
      
      await db.collection('users').doc(userCredential.user.uid).set(userData);
      console.log('✅ New user created in Firestore');
    }
    
    return userData;
  } catch (error: any) {
    console.error('❌ Google sign in error:', error);
    throw new Error(error.message || 'Google ile giriş başarısız oldu.');
  }
};

/**
 * Sign in with Meta (Facebook) using Firebase credential
 * This method expects an access token from Facebook OAuth
 */
export const signInWithMetaCredential = async (accessToken: string): Promise<User> => {
  try {
    console.log('🔵 Signing in with Meta credential...');
    
    // Create Firebase credential from Facebook access token
    const credential = firebase.auth.FacebookAuthProvider.credential(accessToken);
    
    // Sign in with credential
    const userCredential = await auth.signInWithCredential(credential);
    
    if (!userCredential.user) {
      throw new Error('Meta authentication failed - no user returned');
    }
    
    console.log('✅ Meta authentication successful');
    
    // Check if user exists in Firestore
    const userDoc = await db.collection('users').doc(userCredential.user.uid).get();
    
    let userData: User;
    
    if (userDoc.exists) {
      userData = userDoc.data() as User;
      console.log('✅ Existing user loaded from Firestore');
    } else {
      // Create new user
      userData = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName,
        photoURL: userCredential.user.photoURL,
        emailVerified: userCredential.user.emailVerified,
        provider: 'facebook',
        createdAt: new Date(),
      };
      
      await db.collection('users').doc(userCredential.user.uid).set(userData);
      console.log('✅ New user created in Firestore');
    }
    
    return userData;
  } catch (error: any) {
    console.error('❌ Meta sign in error:', error);
    
    // Handle specific errors
    if (error.code === 'auth/account-exists-with-different-credential') {
      throw new Error('Bu e-posta adresi farklı bir yöntemle kullanılıyor.\n\nLütfen başka bir giriş yöntemi deneyin.');
    }
    
    throw new Error(error.message || 'Meta ile giriş başarısız oldu.');
  }
};

/**
 * Sign out
 */
export const signOut = async (): Promise<void> => {
  try {
    await auth.signOut();
  } catch (error: any) {
    throw new Error(error.message || 'Sign out failed');
  }
};

/**
 * Reset password
 */
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await auth.sendPasswordResetEmail(email);
  } catch (error: any) {
    throw new Error(error.message || 'Password reset failed');
  }
};

/**
 * Convert Firebase user to app User type
 */
export const convertFirebaseUser = (firebaseUser: firebase.User): User => {
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName,
    photoURL: firebaseUser.photoURL,
    emailVerified: firebaseUser.emailVerified,
    provider: 'email', // Default, should be updated from Firestore
    createdAt: new Date(firebaseUser.metadata.creationTime || Date.now()),
  };
};

/**
 * Sign in with Google (wrapper for hooks)
 */
export const signInWithGoogle = async (): Promise<User> => {
  throw new Error('Use useGoogleAuth hook instead');
};

/**
 * Sign in with Meta (wrapper for hooks)
 */
export const signInWithMeta = async (): Promise<User> => {
  throw new Error('Use useMetaAuth hook instead');
};

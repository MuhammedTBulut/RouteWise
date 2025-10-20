/**
 * Authentication Service
 * Handles all authentication operations with Firebase
 * Supports email/password, Google, and Apple sign-in
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithCredential,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook';
import { auth, db } from './firebase';
import { User } from '../types/auth';

/**
 * Sign up with email and password
 */
export const signUpWithEmail = async (
  email: string,
  password: string,
  displayName: string
): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update profile with display name
    await updateProfile(userCredential.user, { displayName });
    
    // Create user document in Firestore
    const userData: User = {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      displayName,
      photoURL: null,
      emailVerified: false,
      provider: 'email',
      createdAt: new Date(),
    };
    
    await setDoc(doc(db, 'users', userCredential.user.uid), userData);
    
    return userData;
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
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
    
    if (userDoc.exists()) {
      return userDoc.data() as User;
    }
    
    // If user document doesn't exist, create one
    const userData: User = {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      displayName: userCredential.user.displayName,
      photoURL: userCredential.user.photoURL,
      emailVerified: userCredential.user.emailVerified,
      provider: 'email',
      createdAt: new Date(),
    };
    
    await setDoc(doc(db, 'users', userCredential.user.uid), userData);
    
    return userData;
  } catch (error: any) {
    throw new Error(error.message || 'Sign in failed');
  }
};

/**
 * Sign in with Google
 */
export const signInWithGoogle = async (): Promise<User> => {
  try {
    const provider = new GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    
    // Note: This is a placeholder. Actual implementation requires
    // expo-auth-session configuration with Google OAuth
    // See: https://docs.expo.dev/guides/authentication/#google
    
    throw new Error('Google sign-in not yet configured. Please add your Google OAuth credentials.');
  } catch (error: any) {
    throw new Error(error.message || 'Google sign-in failed');
  }
};

/**
 * Sign in with Meta (Facebook)
 */
export const signInWithMeta = async (): Promise<User> => {
  try {
    // Note: This is a placeholder. Actual implementation requires
    // expo-auth-session configuration with Facebook OAuth
    // See: https://docs.expo.dev/guides/authentication/#facebook
    
    const provider = new FacebookAuthProvider();
    provider.addScope('public_profile');
    provider.addScope('email');
    
    // TODO: Implement Facebook OAuth flow with expo-auth-session
    // 1. Get access token from Facebook
    // 2. Create Firebase credential
    // 3. Sign in with credential
    
    throw new Error('Meta sign-in not yet configured. Please add your Meta App ID and Secret.');
  } catch (error: any) {
    throw new Error(error.message || 'Meta sign-in failed');
  }
};

/**
 * Sign out
 */
export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    throw new Error(error.message || 'Sign out failed');
  }
};

/**
 * Reset password
 */
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    throw new Error(error.message || 'Password reset failed');
  }
};

/**
 * Convert Firebase user to app User type
 */
export const convertFirebaseUser = (firebaseUser: FirebaseUser): User => {
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

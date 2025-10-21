/**
 * Authentication Context
 * Provides authentication state and methods throughout the app
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../services/firebase';
import * as authService from '../services/authService';
import { User, AuthContextType } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        // Convert Firebase user to our User type
        const userData = authService.convertFirebaseUser(firebaseUser);
        setUser(userData);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    const userData = await authService.signInWithEmail(email, password);
    setUser(userData);
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    const userCredential = await authService.signUpWithEmail(email, password, displayName);
    // DON'T set user here - let the screen handle it
    // This prevents auto-navigation to Home screen
    // setUser(userData);
    return userCredential;
  };

  const signInWithGoogle = async () => {
    const userData = await authService.signInWithGoogle();
    setUser(userData);
  };

  const signInWithMeta = async () => {
    const userData = await authService.signInWithMeta();
    setUser(userData);
  };

  const signOut = async () => {
    await authService.signOut();
    setUser(null);
  };

  const resetPassword = async (email: string) => {
    await authService.resetPassword(email);
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithMeta,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

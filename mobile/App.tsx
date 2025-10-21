/**
 * Main App Component
 * Entry point of the application
 */

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Polyfill for Firebase 8 which expects AsyncStorage in react-native
// @ts-ignore
if (typeof global.AsyncStorage === 'undefined') {
  // @ts-ignore
  global.AsyncStorage = AsyncStorage;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppNavigator />
        <StatusBar style="auto" />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

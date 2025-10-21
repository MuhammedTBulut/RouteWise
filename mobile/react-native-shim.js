/**
 * Shim for react-native to provide AsyncStorage for Firebase 8
 * Firebase 8 expects AsyncStorage from 'react-native' but it's been moved to '@react-native-async-storage/async-storage'
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// Re-export everything from react-native
export * from 'react-native';

// Override AsyncStorage with the new package
export { AsyncStorage };

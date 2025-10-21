#!/usr/bin/env node

/**
 * Patch script to add AsyncStorage export to react-native
 * This is needed because Firebase 8 expects AsyncStorage from 'react-native'
 * but it's been moved to '@react-native-async-storage/async-storage'
 */

const fs = require('fs');
const path = require('path');

const reactNativePath = path.join(__dirname, '../node_modules/react-native/index.js');

// Check if react-native exists
if (!fs.existsSync(reactNativePath)) {
  console.log('⚠️  react-native not found, skipping patch');
  process.exit(0);
}

// Read the current content
let content = fs.readFileSync(reactNativePath, 'utf8');

// Check if already patched
if (content.includes('FIREBASE_PATCH_APPLIED')) {
  console.log('✅ react-native already patched for AsyncStorage');
  process.exit(0);
}

// Replace the AsyncStorage getter that throws an error with one that returns the real AsyncStorage
const oldAsyncStorageCode = `  Object.defineProperty(module.exports, 'AsyncStorage', {
    configurable: true,
    get() {
      invariant(
        false,
        'AsyncStorage has been removed from react-native core. ' +
          "It can now be installed and imported from '@react-native-async-storage/async-storage' instead of 'react-native'. " +
          'See https://github.com/react-native-async-storage/async-storage',
      );
    },
  });`;

const newAsyncStorageCode = `  // FIREBASE_PATCH_APPLIED: Modified to return AsyncStorage for Firebase 8 compatibility
  Object.defineProperty(module.exports, 'AsyncStorage', {
    configurable: true,
    get() {
      try {
        return require('@react-native-async-storage/async-storage').default;
      } catch (e) {
        invariant(
          false,
          'AsyncStorage has been removed from react-native core. ' +
            "It can now be installed and imported from '@react-native-async-storage/async-storage' instead of 'react-native'. " +
            'See https://github.com/react-native-async-storage/async-storage',
        );
      }
    },
  });`;

// Apply the patch
content = content.replace(oldAsyncStorageCode, newAsyncStorageCode);

// Write back
fs.writeFileSync(reactNativePath, content, 'utf8');

console.log('✅ Successfully patched react-native to export AsyncStorage');

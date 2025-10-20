/**
 * Navigation Configuration
 * Defines app navigation structure with Auth and Main stacks
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { LoginScreen } from '../screens/LoginScreen';
import { SignUpScreen } from '../screens/SignUpScreen';
import { theme } from '../theme';
import { ActivityIndicator, View, StyleSheet, Text } from 'react-native';

const Stack = createNativeStackNavigator();

// Temporary Home Screen placeholder
const HomeScreen = () => (
  <View style={styles.placeholder}>
    <Text style={styles.placeholderText}>🗺️</Text>
    <Text style={styles.placeholderTitle}>Welcome to RouteWise!</Text>
    <Text style={styles.placeholderSubtitle}>Home screen coming soon...</Text>
  </View>
);

export const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#ffffff' },
        }}
      >
        {user ? (
          // Authenticated Stack
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            {/* Add more authenticated screens here */}
          </>
        ) : (
          // Auth Stack
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  placeholderText: {
    fontSize: 80,
    marginBottom: theme.spacing.lg,
  },
  placeholderTitle: {
    ...theme.typography.h2,
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  placeholderSubtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
});

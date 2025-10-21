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
import { HomeScreen } from '../screens/HomeScreen';
import { POIDetailScreen } from '../screens/POIDetailScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import PreferencesScreen from '../screens/PreferencesScreen';
import LocationSelectionScreen from '../screens/LocationSelectionScreen';
import { theme } from '../theme';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

export type RootStackParamList = {
  Welcome: undefined;
  Preferences: undefined;
  LocationSelection: { preferences: any };
  SignUp: { preferences?: any; city?: string; country?: string };
  Login: undefined;
  Home: undefined;
  POIDetail: { poiId?: string; poi?: any };
  Favorites: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

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
            <Stack.Screen name="POIDetail" component={POIDetailScreen} />
            <Stack.Screen name="Favorites" component={FavoritesScreen} />
            {/* Add more authenticated screens here */}
          </>
        ) : (
          // Auth Stack - Onboarding Flow
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Preferences" component={PreferencesScreen} />
            <Stack.Screen name="LocationSelection" component={LocationSelectionScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
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
});

/**
 * Sign Up Screen
 * Allows users to create a new account with email/password, Google, or Apple
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { useAuth } from '../context/AuthContext';
import {
  validateEmail,
  validatePassword,
  validateDisplayName,
  validateConfirmPassword,
} from '../utils/validation';
import { theme } from '../theme';

export const SignUpScreen = ({ navigation }: any) => {
  const { signUp, signInWithGoogle, signInWithMeta } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{
    displayName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    // Validate inputs
    const nameError = validateDisplayName(displayName);
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const confirmPasswordError = validateConfirmPassword(password, confirmPassword);

    if (nameError || emailError || passwordError || confirmPasswordError) {
      setErrors({
        displayName: nameError,
        email: emailError,
        password: passwordError,
        confirmPassword: confirmPasswordError,
      });
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await signUp(email, password, displayName);
      // Navigation will be handled automatically by auth state change
    } catch (error: any) {
      Alert.alert('Sign Up Failed', error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
    } catch (error: any) {
      Alert.alert('Google Sign Up Failed', error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleMetaSignUp = async () => {
    try {
      setLoading(true);
      await signInWithMeta();
    } catch (error: any) {
      Alert.alert('Meta Sign Up Failed', error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Start your journey with RouteWise</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Input
            label="Full Name"
            placeholder="Enter your full name"
            autoCapitalize="words"
            autoComplete="name"
            value={displayName}
            onChangeText={setDisplayName}
            error={errors.displayName}
            leftIcon={<Text style={styles.icon}>👤</Text>}
          />

          <Input
            label="Email"
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            value={email}
            onChangeText={setEmail}
            error={errors.email}
            leftIcon={<Text style={styles.icon}>📧</Text>}
          />

          <Input
            label="Password"
            placeholder="Create a password"
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password-new"
            value={password}
            onChangeText={setPassword}
            error={errors.password}
            leftIcon={<Text style={styles.icon}>🔒</Text>}
          />

          <Input
            label="Confirm Password"
            placeholder="Re-enter your password"
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password-new"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            error={errors.confirmPassword}
            leftIcon={<Text style={styles.icon}>🔒</Text>}
          />

          {/* Password Requirements */}
          <View style={styles.requirements}>
            <Text style={styles.requirementsTitle}>Password must contain:</Text>
            <Text style={styles.requirementItem}>• At least 8 characters</Text>
            <Text style={styles.requirementItem}>• One uppercase letter</Text>
            <Text style={styles.requirementItem}>• One lowercase letter</Text>
            <Text style={styles.requirementItem}>• One number</Text>
          </View>

          <Button
            title="Sign Up"
            onPress={handleSignUp}
            loading={loading}
            style={styles.signUpButton}
          />
        </View>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Social Sign Up */}
        <View style={styles.socialButtons}>
          <Button
            title="Continue with Google"
            onPress={handleGoogleSignUp}
            variant="outline"
            style={styles.socialButton}
            textStyle={styles.socialButtonText}
          />

          <Button
            title="Continue with Meta"
            onPress={handleMetaSignUp}
            variant="outline"
            style={styles.socialButton}
            textStyle={styles.socialButtonText}
          />
        </View>

        {/* Login Link */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Login</Text>
          </TouchableOpacity>
        </View>

        {/* Terms */}
        <Text style={styles.terms}>
          By signing up, you agree to our{' '}
          <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
          <Text style={styles.termsLink}>Privacy Policy</Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.lg,
  },
  header: {
    marginBottom: theme.spacing.xl,
  },
  backButton: {
    marginBottom: theme.spacing.md,
  },
  backButtonText: {
    ...theme.typography.body,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  form: {
    marginBottom: theme.spacing.lg,
  },
  icon: {
    fontSize: 20,
  },
  requirements: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  requirementsTitle: {
    ...theme.typography.bodySmall,
    color: theme.colors.text,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  requirementItem: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  signUpButton: {
    marginTop: theme.spacing.sm,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border,
  },
  dividerText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginHorizontal: theme.spacing.md,
  },
  socialButtons: {
    gap: theme.spacing.md,
  },
  socialButton: {
    backgroundColor: '#ffffff',
  },
  socialButtonText: {
    color: theme.colors.text,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.xl,
  },
  loginText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  loginLink: {
    ...theme.typography.body,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  terms: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.md,
  },
  termsLink: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
});

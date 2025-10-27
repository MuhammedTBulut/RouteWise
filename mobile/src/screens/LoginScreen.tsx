/**
 * Login Screen
 * Modern and minimalist design for user authentication
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { useAuth } from '../context/AuthContext';
import { useGoogleAuth } from '../hooks/useGoogleAuth';
import { useMetaAuth } from '../hooks/useMetaAuth';
import { validateEmail, validatePassword } from '../utils/validation';
import { theme } from '../theme';

export const LoginScreen = ({ navigation }: any) => {
  const { signIn } = useAuth();
  
  // Google OAuth hook
  const { 
    loading: googleLoading, 
    error: googleError, 
    signInWithGoogle 
  } = useGoogleAuth();
  
  // Meta (Facebook) OAuth hook
  const { 
    loading: metaLoading, 
    error: metaError, 
    signInWithMeta 
  } = useMetaAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // Validate inputs
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await signIn(email, password);
    } catch (error: any) {
      console.log('Login error:', error);
      
      // Firebase hata mesajlarını Türkçe'ye çevir
      let errorMessage = 'Bir hata oluştu. Lütfen tekrar deneyin.';
      
      if (error.message.includes('INVALID_LOGIN_CREDENTIALS') || 
          error.message.includes('invalid-credential') ||
          error.message.includes('wrong-password') ||
          error.message.includes('user-not-found')) {
        errorMessage = 'E-posta veya şifre hatalı. Lütfen kontrol edip tekrar deneyin.\n\nHenüz hesabınız yoksa "Kayıt Ol" butonuna tıklayın.';
      } else if (error.message.includes('invalid-email')) {
        errorMessage = 'Geçersiz e-posta adresi.';
      } else if (error.message.includes('user-disabled')) {
        errorMessage = 'Bu hesap devre dışı bırakılmış.';
      } else if (error.message.includes('too-many-requests')) {
        errorMessage = 'Çok fazla başarısız deneme. Lütfen daha sonra tekrar deneyin.';
      } else if (error.message.includes('network')) {
        errorMessage = 'İnternet bağlantınızı kontrol edin.';
      }
      
      Alert.alert('Giriş Yapılamadı', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      console.log('🔵 Google Sign-In button pressed');
      await signInWithGoogle();
    } catch (error: any) {
      console.error('❌ Google Sign-In error:', error);
      Alert.alert(
        'Google ile Giriş',
        error.message || googleError || 'Bir hata oluştu',
        [{ text: 'Tamam', style: 'default' }]
      );
    }
  };

  const handleMetaSignIn = async () => {
    try {
      console.log('🔵 Meta Sign-In button pressed');
      await signInWithMeta();
    } catch (error: any) {
      console.error('❌ Meta Sign-In error:', error);
      Alert.alert(
        'Meta ile Giriş',
        error.message || metaError || 'Bir hata oluştu',
        [{ text: 'Tamam', style: 'default' }]
      );
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
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>🗺️</Text>
          </View>
          <Text style={styles.title}>Hoş Geldiniz</Text>
          <Text style={styles.subtitle}>RouteWise'a giriş yapın</Text>
        </View>

        {/* Email/Password Form */}
        <View style={styles.form}>
          <Input
            label="E-posta"
            placeholder="ornek@mail.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            value={email}
            onChangeText={setEmail}
            error={errors.email}
          />

          <Input
            label="Şifre"
            placeholder="••••••••"
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password"
            value={password}
            onChangeText={setPassword}
            error={errors.password}
          />

          {/* Forgot Password */}
          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Şifremi Unuttum?</Text>
          </TouchableOpacity>

          <Button
            title="Giriş Yap"
            onPress={handleLogin}
            loading={loading}
            style={styles.loginButton}
          />
        </View>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>veya</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Google OAuth Button */}
        <TouchableOpacity
          style={styles.googleButton}
          onPress={handleGoogleSignIn}
          disabled={googleLoading || loading}
          activeOpacity={0.7}
        >
          {googleLoading ? (
            <ActivityIndicator color="#4285F4" />
          ) : (
            <>
              <Text style={styles.googleIcon}>🔵</Text>
              <Text style={styles.googleButtonText}>Google ile Giriş Yap</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Meta (Facebook) Sign In Button */}
        <TouchableOpacity 
          style={styles.metaButton}
          onPress={handleMetaSignIn}
          disabled={metaLoading || loading}
          activeOpacity={0.7}
        >
          {metaLoading ? (
            <ActivityIndicator color="#1877F2" />
          ) : (
            <>
              <Text style={styles.metaIcon}>📘</Text>
              <Text style={styles.metaButtonText}>Meta ile Giriş Yap</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Sign Up Link */}
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Hesabınız yok mu? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.signupLink}>Kayıt Ol</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    marginBottom: 48,
    alignItems: 'center',
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  logo: {
    fontSize: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '400',
  },
  form: {
    gap: 16,
    marginBottom: 28,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: -8,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#6366F1',
    fontWeight: '600',
  },
  loginButton: {
    marginTop: 12,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 28,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    fontSize: 13,
    color: '#9CA3AF',
    marginHorizontal: 16,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  googleIcon: {
    fontSize: 20,
  },
  googleButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  metaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 12,
    marginTop: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  metaIcon: {
    fontSize: 20,
  },
  metaButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  signupText: {
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '400',
  },
  signupLink: {
    fontSize: 15,
    color: '#6366F1',
    fontWeight: '700',
  },
});

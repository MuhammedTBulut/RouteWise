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
  ActivityIndicator,
} from 'react-native';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { useAuth } from '../context/AuthContext';
import { useGoogleAuth } from '../hooks/useGoogleAuth';
import { useMetaAuth } from '../hooks/useMetaAuth';
import {
  validateEmail,
  validatePassword,
  validateDisplayName,
  validateConfirmPassword,
} from '../utils/validation';
import { theme } from '../theme';
import { preferencesAPI, userAPI } from '../services/api';

export const SignUpScreen = ({ navigation, route }: any) => {
  const { signUp, signOut, user } = useAuth();
  
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
  
  // Get preferences and location from previous screens
  const preferences = route.params?.preferences || {};
  const city = route.params?.city || '';
  const country = route.params?.country || 'Türkiye';
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
      console.log('🚀 Starting sign up process...');
      console.log('📧 Email:', email);
      console.log('👤 Display Name:', displayName);
      console.log('📍 Location:', city, country);
      console.log('🎯 Preferences:', preferences);
      
      // 1. Register user with Firebase
      console.log('1️⃣ Registering with Firebase...');
      const userCredential = await signUp(email, password, displayName);
      const firebaseUid = userCredential?.user?.uid;
      
      console.log('✅ Firebase registration successful. UID:', firebaseUid);
      
      if (firebaseUid) {
        try {
          // 2. Create user in backend database with location
          console.log('2️⃣ Creating user in backend...');
          await userAPI.create({
            firebase_uid: firebaseUid,
            email: email,
            display_name: displayName,
            city: city,
            country: country,
          });
          console.log('✅ User created in backend');
          
          // 3. Save user preferences to backend
          if (Object.keys(preferences).length > 0) {
            console.log('3️⃣ Saving preferences...');
            await preferencesAPI.save(firebaseUid, {
              ...preferences,
              budget_level: 'medium',
              pace: 'moderate',
              group_size: 'small',
            });
            console.log('✅ Preferences saved');
          }
          
          console.log('✅ User and preferences saved to backend!');
        } catch (backendError) {
          console.error('❌ Backend save error:', backendError);
          // Continue anyway - user is registered in Firebase
        }
      }
      
      // Clear form after successful registration
      setDisplayName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      
      // Immediately sign out to prevent auto-navigation
      console.log('4️⃣ Signing out to prevent auto-navigation...');
      await signOut();
      
      // Force loading to stop
      setLoading(false);
      
      // Show success message
      Alert.alert(
        'Kayıt Başarılı! 🎉',
        `Hesabınız başarıyla oluşturuldu.\n\n📍 Konum: ${city}, ${country}\n🎯 Tercihleriniz kaydedildi!\n\nŞimdi giriş yapabilirsiniz.`,
        [{ 
          text: 'Giriş Yap', 
          onPress: () => {
            // Navigation will happen automatically when user is signed out
            // The Welcome screen will show and user can navigate to Login
          }
        }]
      );
      
    } catch (error: any) {
      setLoading(false);
      console.error('❌ SignUp error:', error);
      console.error('❌ Error message:', error.message);
      console.error('❌ Error code:', error.code);
      
      // Firebase hata mesajlarını Türkçe'ye çevir
      let errorMessage = 'Bir hata oluştu. Lütfen tekrar deneyin.';
      
      if (error.code === 'auth/email-already-in-use' || error.message.includes('email-already-in-use')) {
        errorMessage = 'Bu e-posta adresi zaten kullanımda.\n\nGiriş yapmayı deneyin veya şifrenizi sıfırlayın.';
      } else if (error.code === 'auth/invalid-email' || error.message.includes('invalid-email')) {
        errorMessage = 'Geçersiz e-posta adresi.';
      } else if (error.code === 'auth/weak-password' || error.message.includes('weak-password')) {
        errorMessage = 'Şifre çok zayıf. En az 6 karakter olmalıdır.';
      } else if (error.message.includes('network') || error.message.includes('unavailable')) {
        errorMessage = 'İnternet bağlantısı sorunu.\n\n⚠️ Firebase bağlantısı kurulamadı.\nLütfen internet bağlantınızı kontrol edin.';
      } else if (error.message.includes('firestore') || error.message.includes('cloud')) {
        errorMessage = '⚠️ Veritabanı henüz hazır değil.\n\nLütfen Firebase Console\'dan Firestore Database\'i oluşturun ve test modunda başlatın.\n\nSonra tekrar deneyin.';
      }
      
      Alert.alert(
        'Kayıt Yapılamadı',
        errorMessage,
        [{ text: 'Tamam', style: 'default' }]
      );
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      console.log('🔵 Google Sign-Up button pressed');
      await signInWithGoogle();
    } catch (error: any) {
      console.error('❌ Google Sign-Up error:', error);
      Alert.alert(
        'Google ile Kayıt Ol',
        error.message || googleError || 'Bir hata oluştu',
        [{ text: 'Tamam', style: 'default' }]
      );
    }
  };

  const handleMetaSignUp = async () => {
    try {
      console.log('🔵 Meta Sign-Up button pressed');
      await signInWithMeta();
    } catch (error: any) {
      console.error('❌ Meta Sign-Up error:', error);
      Alert.alert(
        'Meta ile Kayıt Ol',
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
          <Text style={styles.title}>Hesap Oluştur</Text>
          <Text style={styles.subtitle}>RouteWise'a katılın</Text>
        </View>

        {/* Progress */}
        {(city || Object.keys(preferences).length > 0) && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '100%' }]} />
            </View>
            <Text style={styles.progressText}>Adım 3/3 - Son Adım!</Text>
          </View>
        )}

        {/* Preview of selections */}
        {city && (
          <View style={styles.previewCard}>
            <Text style={styles.previewTitle}>📍 Seçilen Konum</Text>
            <Text style={styles.previewText}>{city}, {country}</Text>
          </View>
        )}

        {Object.keys(preferences).length > 0 && (
          <View style={styles.previewCard}>
            <Text style={styles.previewTitle}>🎯 Tercihleriniz Hazır</Text>
            <Text style={styles.previewText}>
              {Object.entries(preferences)
                .sort(([, a], [, b]) => (b as number) - (a as number))
                .slice(0, 3)
                .map(([key]) => {
                  const labels: any = {
                    culture: 'Kültür',
                    nightlife: 'Gece Hayatı',
                    shopping: 'Alışveriş',
                    nature: 'Doğa',
                    food: 'Yemek',
                    sports: 'Spor',
                    history: 'Tarih',
                    entertainment: 'Eğlence',
                  };
                  return labels[key];
                })
                .join(', ')}
            </Text>
          </View>
        )}

        {/* Form */}
        <View style={styles.form}>
          <Input
            label="Ad Soyad"
            placeholder="Adınızı girin"
            autoCapitalize="words"
            autoComplete="name"
            value={displayName}
            onChangeText={setDisplayName}
            error={errors.displayName}
          />

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
            placeholder="Şifrenizi oluşturun"
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password-new"
            value={password}
            onChangeText={setPassword}
            error={errors.password}
          />

          <Input
            label="Şifre Tekrar"
            placeholder="Şifrenizi tekrar girin"
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password-new"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            error={errors.confirmPassword}
          />

          <Button
            title="Kayıt Ol"
            onPress={handleSignUp}
            loading={loading}
            style={styles.signUpButton}
          />
        </View>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>veya</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Google Sign Up Button */}
        <TouchableOpacity 
          style={styles.googleButton}
          onPress={handleGoogleSignUp}
          disabled={googleLoading || loading}
          activeOpacity={0.7}
        >
          {googleLoading ? (
            <ActivityIndicator color="#4285F4" />
          ) : (
            <>
              <Text style={styles.googleIcon}>🔵</Text>
              <Text style={styles.googleButtonText}>Google ile Kayıt Ol</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Meta (Facebook) Sign Up Button */}
        <TouchableOpacity 
          style={styles.metaButton}
          onPress={handleMetaSignUp}
          disabled={metaLoading || loading}
          activeOpacity={0.7}
        >
          {metaLoading ? (
            <ActivityIndicator color="#1877F2" />
          ) : (
            <>
              <Text style={styles.metaIcon}>📘</Text>
              <Text style={styles.metaButtonText}>Meta ile Kayıt Ol</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Login Link */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Zaten hesabınız var mı? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Giriş Yap</Text>
          </TouchableOpacity>
        </View>

        {/* OAuth Coming Soon Notice */}
        <View style={styles.oauthNotice}>
          <Text style={styles.oauthNoticeText}>
            💡 Google ve Meta ile kayıt yakında eklenecek
          </Text>
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
  signUpButton: {
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
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  loginText: {
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '400',
  },
  loginLink: {
    fontSize: 15,
    color: '#6366F1',
    fontWeight: '700',
  },
  oauthNotice: {
    marginTop: 32,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    alignItems: 'center',
  },
  oauthNoticeText: {
    fontSize: 13,
    color: '#92400E',
    fontWeight: '500',
    textAlign: 'center',
  },
  progressContainer: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E5EA',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontWeight: '600',
  },
  previewCard: {
    marginHorizontal: 24,
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#f0f8ff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 6,
  },
  previewText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
});

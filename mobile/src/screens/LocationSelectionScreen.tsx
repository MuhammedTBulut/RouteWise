import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';

type LocationSelectionScreenProps = {
  navigation: any;
  route: any;
};

// Türkiye'nin popüler şehirleri
const POPULAR_CITIES = [
  'İstanbul',
  'Ankara',
  'İzmir',
  'Antalya',
  'Bursa',
  'Adana',
  'Gaziantep',
  'Konya',
];

export default function LocationSelectionScreen({ navigation, route }: LocationSelectionScreenProps) {
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('Türkiye');

  const preferences = route.params?.preferences || {};

  const handleCitySelect = (selectedCity: string) => {
    setCity(selectedCity);
  };

  const handleContinue = () => {
    if (!city.trim()) {
      Alert.alert('Uyarı', 'Lütfen şehrinizi seçin');
      return;
    }

    // Tüm bilgileri bir araya getirip SignUp ekranına gönder
    navigation.navigate('SignUp', {
      preferences,
      city,
      country,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backButtonText}>← Geri</Text>
            </TouchableOpacity>
            
            <Text style={styles.title}>Nerelisiniz?</Text>
            <Text style={styles.subtitle}>
              Size yakın mekanları önerebilmek için şehrinizi bilmemiz gerekiyor
            </Text>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '66%' }]} />
            </View>
            <Text style={styles.progressText}>Adım 2/3</Text>
          </View>

          {/* Popular Cities */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📍 Popüler Şehirler</Text>
            <View style={styles.citiesGrid}>
              {POPULAR_CITIES.map((popularCity) => (
                <TouchableOpacity
                  key={popularCity}
                  style={[
                    styles.cityChip,
                    city === popularCity && styles.cityChipSelected,
                  ]}
                  onPress={() => handleCitySelect(popularCity)}
                >
                  <Text
                    style={[
                      styles.cityChipText,
                      city === popularCity && styles.cityChipTextSelected,
                    ]}
                  >
                    {popularCity}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Manual Input */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>✏️ Veya Manuel Girin</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Şehir</Text>
              <TextInput
                style={styles.input}
                placeholder="Şehrinizi yazın..."
                value={city}
                onChangeText={setCity}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Ülke</Text>
              <TextInput
                style={styles.input}
                placeholder="Ülkenizi yazın..."
                value={country}
                onChangeText={setCountry}
                autoCapitalize="words"
              />
            </View>
          </View>

          {/* Preview */}
          {city && (
            <View style={styles.previewContainer}>
              <Text style={styles.previewTitle}>📍 Seçilen Konum</Text>
              <Text style={styles.previewText}>
                {city}, {country}
              </Text>
            </View>
          )}

          {/* Continue Button */}
          <TouchableOpacity 
            style={[styles.continueButton, !city && styles.continueButtonDisabled]}
            onPress={handleContinue}
            disabled={!city}
          >
            <Text style={styles.continueButtonText}>
              {city ? 'Hesap Oluştur ➡️' : 'Şehir Seçin'}
            </Text>
          </TouchableOpacity>

          <View style={styles.bottomSpacing} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingTop: 16,
  },
  backButton: {
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  progressContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
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
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  citiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  cityChip: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: '#f5f5f5',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  cityChipSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  cityChipText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  cityChipTextSelected: {
    color: '#fff',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  input: {
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  previewContainer: {
    marginHorizontal: 24,
    marginBottom: 24,
    padding: 20,
    backgroundColor: '#f0f8ff',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 8,
  },
  previewText: {
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
  },
  continueButton: {
    marginHorizontal: 24,
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  continueButtonDisabled: {
    backgroundColor: '#ccc',
    shadowOpacity: 0,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 40,
  },
});

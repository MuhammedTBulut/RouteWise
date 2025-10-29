import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Slider from '@react-native-community/slider';

type PreferencesScreenProps = {
  navigation: any;
};

// Kategori listesi
const CATEGORIES = [
  { key: 'culture', label: 'Kültür & Sanat', icon: '🎭', description: 'Müzeler, galeriler, tiyatrolar' },
  { key: 'nightlife', label: 'Gece Hayatı', icon: '🌙', description: 'Barlar, kulüpler, canlı müzik' },
  { key: 'shopping', label: 'Alışveriş', icon: '🛍️', description: 'AVM\'ler, butikler, çarşılar' },
  { key: 'nature', label: 'Doğa', icon: '🌳', description: 'Parklar, ormanlar, doğal alanlar' },
  { key: 'food', label: 'Yemek & İçecek', icon: '🍽️', description: 'Restoranlar, kafeler' },
  { key: 'sports', label: 'Spor & Aktivite', icon: '⚽', description: 'Spor salonları, aktivite alanları' },
  { key: 'history', label: 'Tarih', icon: '🏛️', description: 'Tarihi yerler, anıtlar' },
  { key: 'entertainment', label: 'Eğlence', icon: '🎪', description: 'Sinema, bowling, eğlence parkları' },
];

export default function PreferencesScreen({ navigation }: PreferencesScreenProps) {
  const [preferences, setPreferences] = useState<Record<string, number>>({
    culture: 5,
    nightlife: 5,
    shopping: 5,
    nature: 5,
    food: 5,
    sports: 5,
    history: 5,
    entertainment: 5,
  });

  const handleSliderChange = (category: string, value: number) => {
    setPreferences(prev => ({ ...prev, [category]: Math.round(value) }));
  };

  const handleContinue = () => {
    // Tercihleri geçici olarak saklayalım (AsyncStorage'a kaydedilecek)
    // Şimdilik navigation state'inde taşıyoruz
    navigation.navigate('LocationSelection', { preferences });
  };

  const getTopCategories = () => {
    const sorted = Object.entries(preferences)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);
    return sorted.map(([key]) => 
      CATEGORIES.find(c => c.key === key)?.label
    ).join(', ');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Tercihleriniz</Text>
          <Text style={styles.subtitle}>
            Nelerle ilgileniyorsunuz? Size özel öneriler sunabilelim! 
          </Text>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '33%' }]} />
          </View>
          <Text style={styles.progressText}>Adım 1/3</Text>
        </View>

        {/* Categories */}
        <View style={styles.categoriesContainer}>
          {CATEGORIES.map((category) => (
            <View key={category.key} style={styles.categoryCard}>
              <View style={styles.categoryHeader}>
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryIcon}>{category.icon}</Text>
                  <View>
                    <Text style={styles.categoryLabel}>{category.label}</Text>
                    <Text style={styles.categoryDescription}>{category.description}</Text>
                  </View>
                </View>
                <View style={styles.valueContainer}>
                  <Text style={styles.valueText}>{preferences[category.key]}</Text>
                </View>
              </View>
              
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={10}
                step={1}
                value={preferences[category.key]}
                onValueChange={(value: number) => handleSliderChange(category.key, value)}
                minimumTrackTintColor="#007AFF"
                maximumTrackTintColor="#E5E5EA"
                thumbTintColor="#007AFF"
              />
              
              <View style={styles.sliderLabels}>
                <Text style={styles.sliderLabel}>Hiç ilgilenmem</Text>
                <Text style={styles.sliderLabel}>Çok ilgilenirim</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Top Picks Preview */}
        <View style={styles.previewContainer}>
          <Text style={styles.previewTitle}>🎯 En Çok İlgilendiğiniz Alanlar</Text>
          <Text style={styles.previewText}>{getTopCategories()}</Text>
        </View>

        {/* Continue Button */}
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Devam Et ➡️</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingTop: 16,
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
  categoriesContainer: {
    paddingHorizontal: 24,
    gap: 16,
  },
  categoryCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  categoryIcon: {
    fontSize: 32,
  },
  categoryLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  categoryDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  valueContainer: {
    backgroundColor: '#007AFF',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  valueText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  sliderLabel: {
    fontSize: 11,
    color: '#999',
  },
  previewContainer: {
    margin: 24,
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
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
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
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 40,
  },
});

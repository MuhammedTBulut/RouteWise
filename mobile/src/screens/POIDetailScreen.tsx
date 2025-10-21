/**
 * POI Detail Screen
 * Shows detailed information about a Point of Interest
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  Platform,
} from 'react-native';
import { POI } from '../types/poi';
import { poiAPI, favoritesAPI } from '../services/api';
import { theme } from '../theme';

interface POIDetailScreenProps {
  route: {
    params: {
      poiId?: string;
      poi?: POI;
    };
  };
  navigation: any;
}

export const POIDetailScreen: React.FC<POIDetailScreenProps> = ({ route, navigation }) => {
  const [poi, setPoi] = useState<POI | null>(route.params.poi || null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(!route.params.poi);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  useEffect(() => {
    if (route.params.poiId && !route.params.poi) {
      loadPOIDetails();
    }
    if (poi) {
      setIsFavorite(poi.is_favorite || false);
    }
  }, [route.params.poiId, poi?.is_favorite]);

  const loadPOIDetails = async () => {
    try {
      setLoading(true);
      const data = await poiAPI.getById(route.params.poiId!);
      setPoi(data);
      setIsFavorite(data.is_favorite || false);
    } catch (error) {
      console.error('Error loading POI details:', error);
      Alert.alert('Hata', 'Mekan bilgileri yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!poi) return;

    try {
      setFavoriteLoading(true);
      const result = await favoritesAPI.toggle(poi.id);
      setIsFavorite(result.is_favorite);
      
      // Update POI object
      setPoi({ ...poi, is_favorite: result.is_favorite });
    } catch (error) {
      console.error('Error toggling favorite:', error);
      Alert.alert('Hata', 'Favori işlemi sırasında bir hata oluştu.');
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleOpenMaps = () => {
    if (!poi) return;
    
    const scheme = Platform.select({
      ios: 'maps:',
      android: 'geo:',
    });
    const url = Platform.select({
      ios: `${scheme}?q=${poi.latitude},${poi.longitude}&ll=${poi.latitude},${poi.longitude}`,
      android: `${scheme}${poi.latitude},${poi.longitude}?q=${poi.latitude},${poi.longitude}(${poi.name})`,
    });

    if (url) {
      Linking.openURL(url);
    }
  };

  const handleCall = () => {
    if (poi?.phone_number) {
      Linking.openURL(`tel:${poi.phone_number}`);
    }
  };

  const handleWebsite = () => {
    if (poi?.website) {
      Linking.openURL(poi.website);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Text key={i} style={styles.starIcon}>★</Text>
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Text key={i} style={styles.starIcon}>½</Text>
        );
      } else {
        stars.push(
          <Text key={i} style={styles.starIconEmpty}>☆</Text>
        );
      }
    }
    return stars;
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      culture: '🎭',
      nightlife: '🌙',
      shopping: '🛍️',
      nature: '🌿',
      food: '🍴',
      sports: '⚽',
      history: '🏛️',
      entertainment: '🎬',
    };
    return icons[category] || '📍';
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!poi) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorText}>Mekan bilgisi bulunamadı</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Geri Dön</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {poi.name}
        </Text>
        <TouchableOpacity
          style={[styles.headerButton, styles.favoriteButton]}
          onPress={handleToggleFavorite}
          disabled={favoriteLoading}
        >
          {favoriteLoading ? (
            <ActivityIndicator size="small" color={theme.colors.primary} />
          ) : (
            <Text style={styles.heartIcon}>
              {isFavorite ? '❤️' : '🤍'}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Image */}
        {poi.photos && poi.photos.length > 0 ? (
          <Image
            source={{ uri: poi.photos[0] }}
            style={styles.mainImage}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.mainImage, styles.placeholderImage]}>
            <Text style={styles.placeholderIcon}>
              {getCategoryIcon(poi.category)}
            </Text>
          </View>
        )}

        {/* Basic Info */}
        <View style={styles.section}>
          <Text style={styles.name}>{poi.name}</Text>
          
          {/* Rating */}
          {poi.rating > 0 && (
            <View style={styles.ratingContainer}>
              <View style={styles.stars}>
                {renderStars(poi.rating)}
              </View>
              <Text style={styles.ratingText}>
                {poi.rating.toFixed(1)} ({poi.rating_count} değerlendirme)
              </Text>
            </View>
          )}

          {/* Category Badge */}
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryIcon}>{getCategoryIcon(poi.category)}</Text>
            <Text style={styles.categoryText}>
              {poi.category.charAt(0).toUpperCase() + poi.category.slice(1)}
            </Text>
          </View>
        </View>

        {/* Description */}
        {poi.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Hakkında</Text>
            <Text style={styles.description}>{poi.description}</Text>
          </View>
        )}

        {/* Address */}
        {poi.address && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Adres</Text>
            <View style={styles.infoRow}>
              <Text style={styles.iconText}>📍</Text>
              <Text style={styles.infoText}>{poi.address}</Text>
            </View>
            {poi.city && (
              <Text style={styles.cityText}>
                {poi.city}{poi.country ? `, ${poi.country}` : ''}
              </Text>
            )}
          </View>
        )}

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>İletişim</Text>
          
          {poi.phone_number && (
            <TouchableOpacity style={styles.infoRow} onPress={handleCall}>
              <Text style={styles.iconText}>📞</Text>
              <Text style={[styles.infoText, styles.linkText]}>
                {poi.phone_number}
              </Text>
            </TouchableOpacity>
          )}

          {poi.website && (
            <TouchableOpacity style={styles.infoRow} onPress={handleWebsite}>
              <Text style={styles.iconText}>🌐</Text>
              <Text style={[styles.infoText, styles.linkText]} numberOfLines={1}>
                {poi.website}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Additional Info */}
        {(poi.average_visit_duration_minutes || poi.price_level) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ek Bilgiler</Text>
            
            {poi.average_visit_duration_minutes && (
              <View style={styles.infoRow}>
                <Text style={styles.iconText}>⏱️</Text>
                <Text style={styles.infoText}>
                  Ortalama Ziyaret Süresi: {poi.average_visit_duration_minutes} dakika
                </Text>
              </View>
            )}

            {poi.price_level !== undefined && poi.price_level > 0 && (
              <View style={styles.infoRow}>
                <Text style={styles.iconText}>💰</Text>
                <Text style={styles.infoText}>
                  Fiyat Seviyesi: {'$'.repeat(poi.price_level)}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Amenities */}
        {poi.amenities && poi.amenities.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Olanaklar</Text>
            <View style={styles.amenitiesContainer}>
              {poi.amenities.map((amenity, index) => (
                <View key={index} style={styles.amenityBadge}>
                  <Text style={styles.amenityText}>{amenity}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleOpenMaps}
          >
            <Text style={styles.actionIcon}>🧭</Text>
            <Text style={styles.actionButtonText}>Yol Tarifi</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#FFF',
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerButton: {
    padding: 8,
  },
  favoriteButton: {
    marginLeft: 'auto',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginLeft: 12,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  mainImage: {
    width: '100%',
    height: 300,
    backgroundColor: '#F5F5F5',
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stars: {
    flexDirection: 'row',
    marginRight: 8,
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: `${theme.colors.primary}15`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryText: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '600',
    marginLeft: 6,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
  linkText: {
    color: theme.colors.primary,
    textDecorationLine: 'underline',
  },
  cityText: {
    fontSize: 14,
    color: '#999',
    marginLeft: 32,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  amenityBadge: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  amenityText: {
    fontSize: 14,
    color: '#666',
  },
  actionButtonsContainer: {
    padding: 20,
  },
  actionButton: {
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  bottomSpacer: {
    height: 24,
  },
  starIcon: {
    fontSize: 16,
    color: '#FFB800',
    marginRight: 2,
  },
  starIconEmpty: {
    fontSize: 16,
    color: '#DDD',
    marginRight: 2,
  },
  errorIcon: {
    fontSize: 64,
  },
  backArrow: {
    fontSize: 24,
    color: '#000',
  },
  heartIcon: {
    fontSize: 28,
  },
  placeholderIcon: {
    fontSize: 80,
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  iconText: {
    fontSize: 20,
    marginRight: 8,
  },
  actionIcon: {
    fontSize: 24,
    marginRight: 8,
  },
});

/**
 * POI Card Component
 * Displays a Point of Interest in a card format
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { POI } from '../../types/poi';
import { theme } from '../../theme';

interface POICardProps {
  poi: POI;
  onPress: () => void;
  onFavoritePress?: () => void;
}

export const POICard: React.FC<POICardProps> = ({ poi, onPress, onFavoritePress }) => {
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

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      {/* Image */}
      {poi.photos && poi.photos.length > 0 ? (
        <Image
          source={{ uri: poi.photos[0] }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.image, styles.placeholderImage]}>
          <Text style={styles.placeholderIcon}>
            {getCategoryIcon(poi.category)}
          </Text>
        </View>
      )}

      {/* Favorite Button */}
      {onFavoritePress && (
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={(e) => {
            e.stopPropagation();
            onFavoritePress();
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.heartIcon}>
            {poi.is_favorite ? '❤️' : '🤍'}
          </Text>
        </TouchableOpacity>
      )}

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>
            {poi.name}
          </Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryIcon}>{getCategoryIcon(poi.category)}</Text>
          </View>
        </View>

        {poi.address && (
          <Text style={styles.address} numberOfLines={1}>
            📍 {poi.address}
          </Text>
        )}

        {poi.rating > 0 && (
          <View style={styles.ratingContainer}>
            <View style={styles.stars}>
              {renderStars(poi.rating)}
            </View>
            <Text style={styles.ratingText}>
              {poi.rating.toFixed(1)} ({poi.rating_count})
            </Text>
          </View>
        )}

        {poi.description && (
          <Text style={styles.description} numberOfLines={2}>
            {poi.description}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: '#F5F5F5',
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderIcon: {
    fontSize: 60,
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  heartIcon: {
    fontSize: 24,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  name: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginRight: 8,
  },
  categoryBadge: {
    backgroundColor: `${theme.colors.primary}15`,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryIcon: {
    fontSize: 16,
  },
  address: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stars: {
    flexDirection: 'row',
    marginRight: 6,
  },
  starIcon: {
    fontSize: 14,
    color: '#FFB800',
    marginRight: 1,
  },
  starIconEmpty: {
    fontSize: 14,
    color: '#DDD',
    marginRight: 1,
  },
  ratingText: {
    fontSize: 13,
    color: '#999',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

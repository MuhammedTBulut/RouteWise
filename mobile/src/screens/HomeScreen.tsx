/**
 * Home Screen
 * Main screen after user logs in
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { POICard } from '../components/common/POICard';
import { POI } from '../types/poi';
import { cityPOIAPI, favoritesAPI } from '../services/api';

export const HomeScreen = ({ navigation }: any) => {
  const { user, signOut } = useAuth();
  const [pois, setPois] = useState<POI[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadPOIs();
  }, []);

  const loadPOIs = async () => {
    try {
      setLoading(true);
      // Örnek olarak İstanbul'daki POI'leri yüklüyoruz
      // Gerçek uygulamada kullanıcının konumunu veya seçili şehri kullanabilirsiniz
      const data = await cityPOIAPI.getByCity('Istanbul', undefined, undefined, 20);
      setPois(data);
    } catch (error) {
      console.error('Error loading POIs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadPOIs();
    setRefreshing(false);
  };

  const handlePOIPress = (poi: POI) => {
    navigation.navigate('POIDetail', { poi });
  };

  const handleFavoriteToggle = async (poi: POI) => {
    try {
      const result = await favoritesAPI.toggle(poi.id);
      // Update the POI in the list
      setPois(prevPois =>
        prevPois.map(p =>
          p.id === poi.id ? { ...p, is_favorite: result.is_favorite } : p
        )
      );
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Merhaba,</Text>
          <Text style={styles.userName}>{user?.displayName || 'Kullanıcı'}</Text>
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.favoritesButton}
            onPress={() => navigation.navigate('Favorites')}
            activeOpacity={0.7}
          >
            <Text style={styles.favoritesIcon}>❤️</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={handleSignOut}
            activeOpacity={0.7}
          >
            <Text style={styles.signOutIcon}>👋</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <Text style={styles.sectionTitle}>Keşfet</Text>
      <Text style={styles.sectionSubtitle}>Size özel mekanlar</Text>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>🗺️</Text>
      <Text style={styles.emptyTitle}>Henüz mekan bulunamadı</Text>
      <Text style={styles.emptyText}>
        Yakınınızdaki mekanları keşfetmek için konum ayarlarınızı kontrol edin.
      </Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366f1" />
          <Text style={styles.loadingText}>Mekanlar yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={pois}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <POICard
            poi={item}
            onPress={() => handlePOIPress(item)}
            onFavoritePress={() => handleFavoriteToggle(item)}
          />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#6366f1"
          />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  headerContainer: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  favoritesButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  favoritesIcon: {
    fontSize: 24,
  },
  signOutButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  signOutIcon: {
    fontSize: 24,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#000',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 32,
    lineHeight: 24,
  },
});

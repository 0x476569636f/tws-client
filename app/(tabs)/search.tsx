import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, Keyboard } from 'react-native';
import { Link } from 'expo-router';
import { Text } from '~/components/nativewindui/Text';
import { useQuery } from 'react-query';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'react-native';
import ScreenWrapper from '~/components/ScreenWrapperWithNavbar';
import AntDesign from '@expo/vector-icons/AntDesign';
import { ActivityIndicator } from '~/components/nativewindui/ActivityIndicator';
import { API_URL, NOT_AVAILABLE_IMAGE } from '~/constant';
import { debounce } from 'lodash';
import { NewsItem } from '~/types';
import { useColorScheme } from '~/lib/useColorScheme';

const fetchSearchNews = async (query: string): Promise<NewsItem[]> => {
  if (!query.trim()) return [];

  const token = await AsyncStorage.getItem('token');
  const response = await axios.get(`${API_URL}/news`, {
    params: { search: query },
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  return response.data || [];
};

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const [loading, setLoading] = useState(false);
  const { isDarkColorScheme } = useColorScheme();

  const debouncedSearch = debounce((query: string) => {
    setDebouncedQuery(query);
  }, 300);

  const {
    data: searchResults = [],
    isLoading: isQueryLoading,
    error,
  } = useQuery<NewsItem[]>(['searchNews', debouncedQuery], () => fetchSearchNews(debouncedQuery), {
    enabled: debouncedQuery.length > 2,
    staleTime: 5000,
    onSettled: () => setLoading(false),
  });

  useEffect(() => {
    if (searchQuery.length > 2) {
      setLoading(true);
      debouncedSearch(searchQuery);
    } else {
      setDebouncedQuery('');
      setLoading(false);
    }

    return () => {
      debouncedSearch.cancel();
    };
  }, [searchQuery]);

  const renderSearchResultItem = ({ item }: { item: NewsItem }) => (
    <Link
      href={{
        pathname: '/news/[id]',
        params: { id: item.id.toString() },
      }}
      asChild>
      <TouchableOpacity
        className="mb-4 flex-row items-center rounded-xl bg-card p-3"
        accessibilityLabel={`Baca berita: ${item.judul}`}>
        <Image
          source={{ uri: item.image || NOT_AVAILABLE_IMAGE }}
          className="mr-3 h-20 w-20 rounded-lg"
          defaultSource={{ uri: NOT_AVAILABLE_IMAGE }}
        />
        <View className="flex-1">
          <Text className="mb-1 font-inter-semibold text-base" numberOfLines={2}>
            {item.judul}
          </Text>
          <View className="flex-row items-center">
            <Text className="font-inter-regular text-xs text-muted-foreground">
              {item.kategori?.namaKategori || 'Kategori'} • {item.user?.name || 'Penulis'}
            </Text>
          </View>
          <Text className="mt-1 font-inter-regular text-xs text-muted-foreground">
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </TouchableOpacity>
    </Link>
  );

  const renderEmptyState = () => {
    if (loading || isQueryLoading) {
      return (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
        </View>
      );
    }

    if (error) {
      return (
        <View className="flex-1 items-center justify-center">
          <AntDesign name="warning" size={64} className="mb-4 text-muted-foreground" />
          <Text className="text-center font-inter-regular text-muted-foreground">
            Terjadi kesalahan saat memuat berita. Silakan coba lagi.
          </Text>
        </View>
      );
    }

    if (searchQuery.length === 0) {
      return (
        <View className="flex-1 items-center justify-center">
          <AntDesign
            name="search1"
            size={64}
            color={'#007bff'}
            className="mb-4 text-muted-foreground"
          />
          <Text className="text-center font-inter-regular text-muted-foreground">
            Cari berita yang ingin Anda baca
          </Text>
        </View>
      );
    }

    if (searchResults.length === 0) {
      return (
        <View className="flex-1 items-center justify-center">
          <AntDesign name="inbox" size={64} className="mb-4 text-muted-foreground" />
          <Text className="text-center font-inter-regular text-muted-foreground">
            Tidak ada hasil untuk "{searchQuery}"
          </Text>
        </View>
      );
    }

    return null;
  };

  return (
    <ScreenWrapper routeName="Cari Berita">
      <View className="flex-1 px-4">
        {/* Search Input */}
        <View className="mb-4 flex-row items-center rounded-xl bg-card px-4">
          <AntDesign
            name="search1"
            size={24}
            className="mr-3 text-muted-foreground"
            color={'#007bff'}
          />
          <TextInput
            className="h-12 flex-1 font-inter-regular text-base"
            placeholder="Cari berita..."
            placeholderTextColor={isDarkColorScheme ? '#888' : '#ccc'}
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
            }}
            returnKeyType="search"
            onSubmitEditing={() => Keyboard.dismiss()}
            style={{ color: isDarkColorScheme ? 'white' : 'black' }}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSearchQuery('');
                setDebouncedQuery('');
              }}>
              <AntDesign name="closecircle" size={20} className="text-muted-foreground" />
            </TouchableOpacity>
          )}
        </View>

        {/* Search Results */}
        <FlatList
          data={searchResults}
          renderItem={renderSearchResultItem}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 20,
            flexGrow: 1,
          }}
          ListEmptyComponent={renderEmptyState}
        />
      </View>
    </ScreenWrapper>
  );
};

export default SearchScreen;

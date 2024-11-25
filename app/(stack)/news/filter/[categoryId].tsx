import React, { useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useLocalSearchParams, Link } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text } from '~/components/nativewindui/Text';
import ScreenWrapper from '~/components/ScreenWrapperWithNavbar';
import { Image } from 'expo-image';
import AntDesign from '@expo/vector-icons/AntDesign';
import { API_URL } from '~/constant';
import Loading from '~/components/Loading';
import { string } from 'yup';
import { capitalizeWords } from '~/lib/helpers';

interface CategoryWithNews {
  id: number;
  namaKategori: string;
  berita: NewsItem[];
  createdAt: string;
  updatedAt: string;
}

interface NewsItem {
  id: number;
  judul: string;
  isi: string;
  image: string;
  createdAt: string;
  kategoriId: number;
  userId: number;
  user: {
    name: string;
  };
}

const NewsByCategoryScreen = () => {
  const { categoryId } = useLocalSearchParams();
  const [categoryNews, setCategoryNews] = useState<CategoryWithNews | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNewsByCategory = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${API_URL}/news-category/${categoryId}?withNews=true`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setCategoryNews(response.data);
      setLoading(false);
      setError(null);
    } catch (err) {
      console.error('Error fetching news by category:', err);
      setError('Gagal memuat berita kategori');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewsByCategory();
  }, [categoryId]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchNewsByCategory().then(() => setRefreshing(false));
  }, []);

  const renderNewsItem = ({ item }: { item: NewsItem }) => (
    <Link
      href={{
        pathname: '/news/[id]',
        params: { id: item.id.toString() },
      }}
      asChild>
      <TouchableOpacity className="mb-4 flex-row rounded-xl bg-card p-3">
        <Image
          source={{
            uri:
              item.image ||
              'https://cydmneaqnonivedzegsi.supabase.co/storage/v1/object/public/images/not-available.jpg',
          }}
          style={{ width: 100, height: 100, borderRadius: 10 }}
          contentFit="cover"
        />
        <View className="ml-3 flex-1 justify-center">
          <Text className="font-inter-semibold text-base" numberOfLines={2}>
            {capitalizeWords(item.judul)}
          </Text>
          <View className="mt-1 flex-row items-center">
            <Text className="font-inter-regular text-xs text-muted-foreground">
              {item.user?.name || 'Penulis'} • {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );

  if (loading) {
    return (
      <ScreenWrapper routeName="Berita Kategori">
        <View className="flex-1 items-center justify-center">
          <Loading />
        </View>
      </ScreenWrapper>
    );
  }

  if (error) {
    return (
      <ScreenWrapper routeName="Berita Kategori">
        <View className="flex-1 items-center justify-center p-4">
          <AntDesign name="warning" size={64} color="red" />
          <Text className="mt-4 text-center font-inter-regular text-lg">{error}</Text>
          <TouchableOpacity
            onPress={fetchNewsByCategory}
            className="mt-4 rounded-lg bg-primary p-3">
            <Text className="font-inter-regular text-white">Coba Lagi</Text>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper routeName={`Berita ${categoryNews?.namaKategori || 'Kategori'}`}>
      <View className="mt-4 flex-1 px-4">
        <View className="mb-4 flex-row items-center">
          <Text className="font-inter-medium text-xl">
            {capitalizeWords(categoryNews?.namaKategori || 'Kategori')}
          </Text>
          <Text className="ml-2 font-inter-regular text-muted-foreground">
            {categoryNews?.berita?.length || 0} Berita
          </Text>
        </View>

        {categoryNews?.berita?.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <AntDesign name="inbox" size={64} color="gray" />
            <Text className="mt-4 text-center font-inter-regular text-lg text-muted-foreground">
              Tidak ada berita dalam kategori ini
            </Text>
          </View>
        ) : (
          <FlatList
            data={categoryNews?.berita}
            renderItem={renderNewsItem}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          />
        )}
      </View>
    </ScreenWrapper>
  );
};

export default NewsByCategoryScreen;

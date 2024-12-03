import React from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  FlatList,
  RefreshControl,
} from 'react-native';
import { useQueries } from 'react-query';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text } from '~/components/nativewindui/Text';
import ScreenWrapper from '~/components/ScreenWrapperWithNavbar';
import Carousel from 'react-native-reanimated-carousel';
import { Image } from 'expo-image';
import FontAwesome from '@expo/vector-icons/FontAwesome5';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useAuth } from '~/context/auth';
import { API_URL, NOT_AVAILABLE_IMAGE } from '~/constant';
import SkeletonHome from '~/components/SkeletonHome';
import { Link } from 'expo-router';
import { capitalizeWords } from '~/lib/helpers';
import { NewsItem, Category as CategoryItem } from '~/types';
import { usePreventDoubleNavigation } from '~/hooks/usePreventDoubleNavigation';
import { useColorScheme } from '~/lib/useColorScheme';

const fetchNews = async (): Promise<NewsItem[]> => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.get(`${API_URL}/news`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return Array.isArray(response.data)
      ? response.data
      : response.data.data || response.data.results || [];
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
};

const fetchCategories = async (): Promise<CategoryItem[]> => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.get(`${API_URL}/news-category`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return Array.isArray(response.data)
      ? response.data
      : response.data.data || response.data.results || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

const getCategoryIcon = (categoryName: string) => {
  const iconMap: { [key: string]: string } = {
    Teknologi: 'laptop',
    Ekonomi: 'money-bill-wave',
    Olahraga: 'futbol',
    Hiburan: 'film',
    Politik: 'landmark',
    default: 'newspaper',
  };

  return iconMap[categoryName] || iconMap['default'];
};

const Home = () => {
  const { user } = useAuth();
  const { width } = Dimensions.get('window');
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const { navigateSafely } = usePreventDoubleNavigation();
  const { isDarkColorScheme } = useColorScheme();

  React.useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setIsAdmin(parsedUser.role === 'ADMIN');
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
      }
    };

    checkAdminStatus();
  }, []);

  const handleAddNews = () => {
    navigateSafely('/news/add', 'push');
  };

  const [
    { data: news = [], isLoading: isNewsLoading, isError: isNewsError, refetch: refetchNews },
    {
      data: categories = [],
      isLoading: isCategoriesLoading,
      isError: isCategoriesError,
      refetch: refetchCategories,
    },
  ] = useQueries([
    {
      queryKey: 'news',
      queryFn: fetchNews,
      staleTime: 0,
      cacheTime: 0,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
    },
    {
      queryKey: 'categories',
      queryFn: fetchCategories,
      staleTime: 0,
      cacheTime: 0,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
    },
  ]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    Promise.all([refetchNews(), refetchCategories()])
      .then(() => {
        setRefreshing(false);
      })
      .catch((error) => {
        console.error('Refresh error:', error);
        setRefreshing(false);
      });
  }, [refetchNews, refetchCategories]);

  const renderTrendingItem = ({ item }: { item: NewsItem }) => (
    <Link
      href={{
        pathname: '/news/[id]',
        params: { id: item.id.toString() },
      }}
      asChild>
      <TouchableOpacity
        className="relative overflow-hidden rounded-xl"
        style={{ width: width * 0.89, height: 200 }}>
        <Image
          source={{
            uri: item.image || NOT_AVAILABLE_IMAGE,
          }}
          style={{ width: '100%', height: '100%' }}
          contentFit="cover"
        />
        <View className="absolute bottom-0 left-0 right-0 bg-black/50 p-4">
          <Text className="font-inter-bold text-lg text-white" numberOfLines={2}>
            {capitalizeWords(
              item.judul.split(' ').slice(0, 6).join(' ') +
                (item.judul.split(' ').length > 6 ? '...' : '')
            )}
          </Text>
          <View className="mt-2 flex-row justify-between">
            <Text className="font-inter-regular text-xs text-white/80">
              {item.kategori?.namaKategori || 'Kategori'} • Ditulis oleh{' '}
              {item.user?.name || 'Penulis'}
            </Text>
            <Text className="font-inter-regular text-xs text-white/80">
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );

  const renderCategoryItem = ({ item }: { item: CategoryItem }) => {
    return (
      <Link
        href={{
          pathname: '/news/filter/[categoryId]',
          params: { categoryId: item.id.toString() },
        }}
        asChild>
        <TouchableOpacity
          className="ios:border-primary ios:active:bg-primary/20 mr-4 h-20 w-20 items-center justify-center rounded-xl bg-card p-3"
          accessibilityLabel={`Lihat berita untuk kategori ${item.namaKategori}`}
          accessibilityRole="button">
          <FontAwesome
            name={getCategoryIcon(item.namaKategori)}
            size={24}
            color={isDarkColorScheme ? '#007bff' : 'black'}
          />
          <Text className="mt-2 text-center text-xs">{item.namaKategori}</Text>
        </TouchableOpacity>
      </Link>
    );
  };

  const renderLatestNewsItem = ({ item }: { item: NewsItem }) => (
    <Link
      href={{
        pathname: '/news/[id]',
        params: { id: item.id.toString() },
      }}
      asChild>
      <TouchableOpacity className="mb-3 flex-row rounded-xl bg-card p-3">
        <Image
          source={{
            uri: item.image || NOT_AVAILABLE_IMAGE,
          }}
          style={{ width: 100, height: 100, borderRadius: 10 }}
          contentFit="cover"
        />
        <View className="ml-3 flex-1 justify-center">
          <Text className="font-inter-semibold text-base" numberOfLines={2}>
            {capitalizeWords(item.judul)}
          </Text>
          <View className="mt-1 flex-row">
            <Text className="font-inter-regular text-xs text-muted-foreground">
              {item.kategori?.namaKategori || 'Kategori'} • Ditulis oleh{' '}
              {item.user?.name || 'Penulis'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );

  if (isNewsLoading || isCategoriesLoading) {
    return <SkeletonHome />;
  }

  if (isNewsError || isCategoriesError || !Array.isArray(news) || !Array.isArray(categories)) {
    return (
      <ScreenWrapper routeName="Beranda">
        <View className="flex-1 items-center justify-center p-4">
          <AntDesign name="warning" size={64} color="red" />
          <Text className="mt-4 text-center font-inter-regular text-lg">
            Gagal memuat berita atau kategori. Silakan periksa koneksi internet Anda.
          </Text>
          <TouchableOpacity
            onPress={() => {
              refetchNews();
              refetchCategories();
            }}
            className="mt-4 rounded-lg bg-primary p-3">
            <Text className="font-inter-regular text-white">Coba Lagi</Text>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    );
  }

  // Pastikan news dan categories adalah array sebelum dirender
  const safeNews = Array.isArray(news) ? news : [];
  const safeCategories = Array.isArray(categories) ? categories : [];

  return (
    <ScreenWrapper routeName="Beranda">
      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {/* Header */}
        <View className="mb-4 flex-row items-center justify-between">
          <View>
            <Text variant="title1" className="font-inter-bold">
              Selamat Datang, {user?.name || 'Pengguna'}
            </Text>
            <Text className="font-inter-regular text-muted-foreground">
              Temukan berita terkini hari ini
            </Text>
          </View>
        </View>

        {/* Trending News Carousel */}
        <View className="mb-4">
          <Text className="mb-2 font-inter-bold text-lg">Trending Hari Ini</Text>
          <Carousel
            loop
            width={width * 0.9}
            height={200}
            autoPlay
            data={safeNews}
            scrollAnimationDuration={2000}
            renderItem={renderTrendingItem}
          />
        </View>

        {/* News Categories */}
        <View className="mb-4">
          <Text className="mb-2 font-inter-bold text-lg">Kategori Berita</Text>
          <FlatList
            horizontal
            data={safeCategories}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id.toString()}
            showsHorizontalScrollIndicator={false}
          />
        </View>

        {/* Latest News */}
        <View>
          <Text className="mb-2 font-inter-bold text-lg">Berita Terbaru</Text>
          <FlatList
            data={safeNews}
            renderItem={renderLatestNewsItem}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
      {isAdmin && (
        <TouchableOpacity
          onPress={handleAddNews}
          className="absolute bottom-12 right-4 h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg"
          style={{
            elevation: 5,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
          }}>
          <FontAwesome name="plus" size={24} color="white" />
        </TouchableOpacity>
      )}
    </ScreenWrapper>
  );
};

export default Home;

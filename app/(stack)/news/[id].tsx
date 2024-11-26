import React from 'react';
import { View, ScrollView, TouchableOpacity, Dimensions, Share, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text } from '~/components/nativewindui/Text';
import ScreenWrapper from '~/components/ScreenWrapperWithNavbar';
import { API_URL, NOT_AVAILABLE_IMAGE } from '~/constant';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useColorScheme } from '~/lib/useColorScheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { capitalizeWords } from '~/lib/helpers';
import SkeletonNewsDetail from '~/components/SkeletonNewsDetail';
import { useQuery } from 'react-query';
import axios from 'axios';

interface NewsDetail {
  id: number;
  judul: string;
  isi: string;
  image: string;
  createdAt: string;
  kategori: {
    namaKategori: string;
  };
  user: {
    name: string;
  };
}

const fetchNewsDetail = async (id: string) => {
  const token = await AsyncStorage.getItem('token');
  const response = await axios.get(`${API_URL}/news/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

const NewsDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { colors } = useColorScheme();
  const insets = useSafeAreaInsets();

  const {
    data: newsDetail,
    error,
    isLoading,
  } = useQuery<NewsDetail, Error>(['newsDetail', id], () => fetchNewsDetail(id as string), {
    enabled: !!id,
  });

  const handleShare = async () => {
    try {
      await Share.share({
        title: newsDetail?.judul,
        message: `Baca berita menarik: ${newsDetail?.judul}\n\nBuka sekarang di Vigenesia App`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatNewsContent = (content: string) => {
    if (!content) return null;

    const paragraphs = content.split('\n').filter((p) => p.trim() !== '');

    return paragraphs.map((paragraph, index) => (
      <Text
        variant={'body'}
        key={index}
        className="mb-6 text-justify font-inter-regular leading-relaxed text-foreground">
        {paragraph.trim()}
      </Text>
    ));
  };

  if (isLoading) {
    return <SkeletonNewsDetail />;
  }

  if (error || !newsDetail) {
    return (
      <ScreenWrapper routeName="Detail Berita">
        <View className="flex-1 items-center justify-center p-4">
          <AntDesign name="warning" size={64} color="red" />
          <Text className="mt-4 text-center font-inter-regular text-lg">
            {error?.message || 'Berita tidak ditemukan'}
          </Text>
          <TouchableOpacity
            onPress={() => window.location.reload()}
            className="mt-4 rounded-lg bg-primary p-3">
            <Text className="font-inter-regular text-white">Coba Lagi</Text>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper routeName="Detail Berita">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: Platform.OS === 'android' ? insets.bottom + 20 : 20,
        }}>
        {/* Header Actions */}
        <View
          className="absolute left-4 right-4 top-[-30px] z-10 flex-row justify-between"
          style={{
            paddingTop: insets.top + 10,
            shadowColor: colors.foreground,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
          }}>
          <TouchableOpacity
            onPress={() => router.back()}
            className="rounded-full p-2"
            style={{
              backgroundColor: colors.card + '30',
            }}>
            <AntDesign name="arrowleft" size={24} color={colors.foreground} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleShare}
            className="rounded-full p-2"
            style={{
              backgroundColor: colors.card + '30',
            }}>
            <Ionicons name="share-social" size={24} color={colors.foreground} />
          </TouchableOpacity>
        </View>

        {/* Hero Image */}
        <View className="relative">
          <Image
            source={{
              uri: newsDetail?.image || NOT_AVAILABLE_IMAGE,
            }}
            style={{
              width: Dimensions.get('window').width,
              height: 250,
            }}
            contentFit="cover"
          />
          <View
            className="absolute bottom-0 left-0 right-0 bg-black/50 p-4"
            style={{
              borderBottomLeftRadius: 20,
              borderBottomRightRadius: 20,
            }}>
            <Text className="font-inter-bold text-xl text-white" numberOfLines={2}>
              {capitalizeWords(newsDetail?.judul)}
            </Text>
          </View>
        </View>

        {/* News Metadata */}
        <View className="flex-row items-center justify-between p-4">
          <View>
            <Text className="font-inter-semibold text-base text-muted-foreground">
              {newsDetail?.kategori?.namaKategori || 'Kategori'}
            </Text>
            <Text className="font-inter-regular text-sm text-muted-foreground">
              {newsDetail ? formatDate(newsDetail.createdAt) : ''}
            </Text>
          </View>
          <View className="flex-row items-center">
            <AntDesign name="user" size={16} className="mr-2 text-muted-foreground" />
            <Text className="font-inter-regular text-sm text-muted-foreground">
              {newsDetail?.user?.name || 'Penulis'}
            </Text>
          </View>
        </View>

        {/* News Content */}
        <View className="px-4">{formatNewsContent(newsDetail?.isi)}</View>
      </ScrollView>
    </ScreenWrapper>
  );
};

export default NewsDetailScreen;

import React from 'react';
import { View, FlatList, TouchableOpacity, Alert, ScrollView, Platform } from 'react-native';
import { Text } from '~/components/nativewindui/Text';
import { API_URL, DEFAULT_AVATAR } from '~/constant';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from '@expo/vector-icons/AntDesign';
import ScreenWrapper from '~/components/ScreenWrapperWithNavbar';
import { Motivation } from '~/types';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import { Avatar, AvatarImage } from '~/components/nativewindui/Avatar';
import { useColorScheme } from '~/lib/useColorScheme';
import { formatTime } from '~/lib/helpers';
import Toast from 'react-native-toast-message';
import { useAuth } from '~/context/auth';
import { usePreventDoubleNavigation } from '~/hooks/usePreventDoubleNavigation';
import MotivationSkeletonLoader from '~/components/SkeletonMotivationScreen';

const fetchMotivations = async (): Promise<Motivation[]> => {
  const token = await AsyncStorage.getItem('token');
  const response = await axios.get(`${API_URL}/motivations`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

const deleteMotivation = async (id: string) => {
  const token = await AsyncStorage.getItem('token');
  await axios.delete(`${API_URL}/motivations/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
};

const MotivationScreen = () => {
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const { isDarkColorScheme } = useColorScheme();
  const { user } = useAuth();
  const { navigateSafely, isNavigating } = usePreventDoubleNavigation();

  const { data: motivations = [], isLoading } = useQuery('motivations', fetchMotivations);

  const mutation = useMutation(deleteMotivation, {
    onSuccess: () => {
      queryClient.invalidateQueries('motivations');
      Toast.show({
        type: 'success',
        text1: 'Berhasil Menghapus Motivasi',
        visibilityTime: 2000,
        topOffset: 60,
      });
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Gagal Menghapus Motivasi',
        text2: error.response?.data?.message || 'Terjadi kesalahan saat menghapus motivasi.',
        visibilityTime: 2000,
        topOffset: 60,
      });
    },
  });

  const handleDelete = (id: string) => {
    Alert.alert(
      'Konfirmasi Hapus',
      'Apakah Anda yakin ingin menghapus motivasi ini?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          onPress: () => mutation.mutate(id),
          style: 'destructive',
        },
      ],
      { cancelable: false }
    );
  };

  const handleAdd = () => {
    navigateSafely('/motivation/add-or-update', 'push');
  };

  const renderMotivationItem = ({ item }: { item: Motivation }) => (
    <View className="dark:bg-android-card dark:border-android-border mb-3 rounded-xl border border-border bg-card p-4 shadow-sm">
      <View className="mb-3 flex-row items-center">
        <Avatar
          alt="User Image"
          className="dark:bg-android-muted mr-3 h-10 w-10 rounded-full bg-muted">
          <AvatarImage source={{ uri: DEFAULT_AVATAR }} />
        </Avatar>
        <View>
          <Text className="dark:text-android-card-foreground font-inter-semibold text-card-foreground">
            {item.user.name}
          </Text>
          <Text className="dark:text-android-muted-foreground font-inter-regular text-xs text-muted-foreground">
            {item.user.role.toLocaleLowerCase()}
          </Text>
        </View>
      </View>

      <Text className="dark:text-android-card-foreground mb-3 font-inter-regular text-base text-card-foreground">
        {item.isi_motivasi}
      </Text>

      <View className="flex-row items-center justify-between">
        <Text className="dark:text-android-muted-foreground font-inter-regular text-xs text-muted-foreground">
          {formatTime(item.updatedAt)}
        </Text>

        {(user?.role === 'ADMIN' || item.userId === user?.id) && (
          <View className="flex-row items-center space-x-3">
            <TouchableOpacity
              disabled={isNavigating}
              onPress={() => handleDelete(item.id as unknown as string)}>
              <AntDesign name="delete" size={18} color={isDarkColorScheme ? '#fff' : '#000'} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <ScreenWrapper routeName="Motivasi">
        <MotivationSkeletonLoader />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper routeName="Motivasi">
      <ScrollView
        className="dark:bg-android-background flex-1 bg-background px-4 pt-3"
        contentContainerStyle={{
          paddingBottom: Platform.OS === 'android' ? insets.bottom + 20 : 20,
        }}>
        <FlatList
          data={motivations}
          renderItem={renderMotivationItem}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
        />
      </ScrollView>

      <TouchableOpacity
        onPress={handleAdd}
        className="absolute bottom-12 right-4 h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg"
        style={{
          elevation: 5,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
        }}>
        <FontAwesome5 name="plus" size={24} color="white" />
      </TouchableOpacity>
    </ScreenWrapper>
  );
};

export default MotivationScreen;

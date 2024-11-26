import React, { useEffect, useState } from 'react';
import { View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Text } from '~/components/nativewindui/Text';
import ScreenWrapper from '~/components/ScreenWrapperWithNavbar';
import Loading from '~/components/Loading';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '~/context/auth';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Avatar, AvatarImage } from '~/components/nativewindui/Avatar';
import { DEFAULT_AVATAR } from '~/constant';

const ProfileScreen = () => {
  const router = useRouter();
  const { logout } = useAuth();
  const [userProfile, setUserProfile] = useState<{
    name: string;
    email: string;
    role: string;
    avatar: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfile = async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      if (user) {
        setUserProfile(JSON.parse(user));
      } else {
        setError('User  data not found');
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      'Logout Confirmation',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => {
            logout();
          },
        },
      ],
      { cancelable: false }
    );
  };

  if (loading) {
    return (
      <ScreenWrapper routeName="Profile">
        <View className="flex-1 items-center justify-center">
          <Loading />
        </View>
      </ScreenWrapper>
    );
  }

  if (error) {
    return (
      <ScreenWrapper routeName="Profile">
        <View className="flex-1 items-center justify-center p-4">
          <AntDesign name="warning" size={64} color="red" />
          <Text className="mt-4 text-center font-inter-regular text-lg">{error}</Text>
          <TouchableOpacity onPress={fetchUserProfile} className="mt-4 rounded-lg bg-primary p-3">
            <Text className="font-inter-regular text-white">Try Again</Text>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper routeName="Profile">
      <ScrollView className="flex-1 rounded-md p-6" showsVerticalScrollIndicator={false}>
        <View className="mb-4 flex flex-col items-center">
          {/* Display Avatar */}
          <Avatar className="mb-4 h-24 w-24 rounded-full border-2 border-muted" alt="User  avatar">
            <AvatarImage source={{ uri: userProfile?.avatar || DEFAULT_AVATAR }} />
          </Avatar>
          <Text className="font-inter-medium text-2xl">{userProfile?.name}</Text>
          <Text className="font-inter-regular text-lg text-muted-foreground">
            {userProfile?.email}
          </Text>
          <Text className="font-inter-regular text-sm text-muted-foreground">
            {userProfile?.role}
          </Text>
        </View>

        <TouchableOpacity onPress={handleLogout} className="mt-6 rounded-lg bg-red-500 p-3">
          <Text className="text-center font-inter-regular text-white">Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  );
};

export default ProfileScreen;

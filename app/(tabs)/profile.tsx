import { View } from 'react-native';
import React from 'react';
import ScreenWrapper from '~/components/ScreenWrapperWithNavbar';
import { Text } from '~/components/nativewindui/Text';
import { Button } from '~/components/nativewindui/Button';
import { useAuth } from '~/context/auth';

const Home = () => {
  const { logout } = useAuth();
  return (
    <ScreenWrapper routeName="Beranda">
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg">Selamat datang di aplikasi ini!</Text>
      </View>
      <Button onPress={logout}>
        <Text className="font-inter-regular">Logout</Text>
      </Button>
    </ScreenWrapper>
  );
};

export default Home;

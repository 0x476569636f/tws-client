import { Text } from '~/components/nativewindui/Text';
import React from 'react';
import ScreenWrapper from '~/components/ScreenWrapperWithNavbar';
import { Image, View } from 'react-native';
import { ActivityIndicator } from '~/components/nativewindui/ActivityIndicator';

const index = () => {
  return (
    <ScreenWrapper>
      <View className="flex-1 items-center justify-center space-y-4">
        <Image source={require('~/assets/bg.png')} className="h-40 w-40" />
        <Text className="font-inter-bold text-xl text-blue-500">VIGENESIA</Text>
        <View className="flex-row items-center">
          <Text className="mr-2">Memuat</Text>
          <ActivityIndicator size="small" color="#0000ff" />
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default index;

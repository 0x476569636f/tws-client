import { Text } from '~/components/nativewindui/Text';
import React from 'react';
import ScreenWrapper from '~/components/ScreenWrapperWithNavbar';
import { View } from 'react-native';

const index = () => {
  return (
    <ScreenWrapper routeName="Motivasi">
      <View className="flex-1 items-center justify-center space-y-4">
        <Text className="mr-2">Add motivasi</Text>
      </View>
    </ScreenWrapper>
  );
};

export default index;

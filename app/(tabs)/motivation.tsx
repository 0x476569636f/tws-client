import { View } from 'react-native';
import React from 'react';
import ScreenWrapper from '~/components/ScreenWrapperWithNavbar';
import { Text } from '~/components/nativewindui/Text';

const MotivationScreen = () => {
  return (
    <ScreenWrapper routeName="Motivasi">
      <View>
        <Text>Motivation Screen</Text>
      </View>
    </ScreenWrapper>
  );
};

export default MotivationScreen;

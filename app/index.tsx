import { View } from 'react-native';
import { Text } from '~/components/nativewindui/Text';
import React from 'react';
import { Button } from '~/components/nativewindui/Button';
import { useRouter } from 'expo-router';
import ScreenWrapper from '~/components/ScreenWrapperWithNavbar';

const index = () => {
  const router = useRouter();
  return (
    <ScreenWrapper>
      <Text>Halo dunia</Text>
      <Button onPress={() => router.push('/welcome')}>
        <Text>Login</Text>
      </Button>
    </ScreenWrapper>
  );
};

export default index;

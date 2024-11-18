import React, { useEffect } from 'react';
import { View, Pressable } from 'react-native';
import { Button } from '~/components/nativewindui/Button';
import ScreenWrapper from '~/components/ScreenWrapperWithNavbar';
import { Text } from '~/components/nativewindui/Text';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { usePreventDoubleNavigation } from '~/hooks/usePreventDoubleNavigation';

const Welcome = () => {
  const router = useRouter();
  const { navigateSafely, isNavigating } = usePreventDoubleNavigation();

  // Animasi translasi vertikal untuk logo
  const translateY = useSharedValue(0);

  // Efek untuk memulai animasi
  useEffect(() => {
    // Animasi naik-turun
    translateY.value = withRepeat(
      withTiming(20, {
        duration: 1500,
        easing: Easing.inOut(Easing.ease),
      }),
      -1, // Infinite repeat
      true // Reverse
    );
  }, []);

  // Style animasi untuk logo
  const animatedLogoStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: translateY.value,
        },
      ],
    };
  });

  return (
    <ScreenWrapper>
      <View className="flex-1 items-center justify-around px-4">
        <View className="flex items-center">
          <Animated.Image
            source={require('~/assets/bg.png')}
            resizeMode="contain"
            style={[
              {
                height: 240,
                width: 240,
              },
              animatedLogoStyle,
            ]}
            className="h-60 w-60"
          />
        </View>

        <View className="gap-2">
          <Text
            className="font-inter-bold text-center"
            variant={'largeTitle'}
            style={{
              textShadowColor: 'rgba(0, 0, 0, 0.15)',
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 3,
            }}>
            VIGENESIA
          </Text>
          <Text
            className="font-inter-regular text-center"
            variant={'subhead'}
            style={{
              opacity: 0.7,
            }}>
            Inspirasi dan Informasi Setiap Hari
          </Text>
        </View>

        <View className="w-full gap-7">
          <Button
            onPress={() => navigateSafely('/', 'push')}
            disabled={isNavigating}
            style={{
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}>
            <Text className="font-inter-regular p-1">Mulai Sekarang</Text>
          </Button>
        </View>

        <View className="mb-6 flex flex-row items-center gap-1">
          <Text variant={'subhead'} className="font-inter-regular">
            Sudah punya akun?
          </Text>
          <Pressable onPress={() => navigateSafely('/', 'push')}>
            <Text variant={'subhead'} className="font-inter-semibold font-semibold text-primary">
              Masuk
            </Text>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Welcome;

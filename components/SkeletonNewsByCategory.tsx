import React from 'react';
import { View, Dimensions } from 'react-native';
import ScreenWrapper from '~/components/ScreenWrapperWithNavbar';

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';

const SkeletonNewsByCategory = () => {
  const { width } = Dimensions.get('window');

  const loadingAnimation = useSharedValue(0);

  React.useEffect(() => {
    loadingAnimation.value = withRepeat(withTiming(1, { duration: 1500 }), -1, true);
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      loadingAnimation.value,
      [0, 1],
      ['rgba(175, 176, 180, 0.2)', 'rgba(175, 176, 180, 0.1)']
    );
    return {
      backgroundColor,
    };
  });

  // Skeleton Item
  const SkeletonItem = () => (
    <Animated.View
      style={[animatedStyle, { width: width * 0.9, height: 100 }]}
      className="bg-muted/20 mb-4 rounded-md"
    />
  );

  return (
    <ScreenWrapper routeName="Berita Kategori">
      <View className="flex-1 p-4">
        {/* Skeleton Header */}
        <View className="mb-4">
          <Animated.View style={animatedStyle} className="bg-muted/20 mb-2 h-6 w-3/5 rounded-md" />
          <Animated.View style={animatedStyle} className="bg-muted/20 h-4 w-2/5 rounded-md" />
        </View>

        {/* Skeleton List */}
        <View className="flex-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <SkeletonItem key={index} />
          ))}
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default SkeletonNewsByCategory;

import React from 'react';
import { View, Dimensions } from 'react-native';
import ScreenWrapper from '~/components/ScreenWrapperWithNavbar';
import { Text } from '~/components/nativewindui/Text';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';

const SkeletonHome = () => {
  const { width } = Dimensions.get('window');

  // Animasi loading
  const loadingAnimation = useSharedValue(0);

  React.useEffect(() => {
    loadingAnimation.value = withRepeat(withTiming(1, { duration: 1500 }), -1, true);
  }, []);

  // Animasi warna skeleton
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

  // Skeleton Trending Item
  const SkeletonTrendingItem = () => (
    <Animated.View
      style={[animatedStyle, { width: width * 0.8, height: 250 }]}
      className="bg-muted/20 relative mb-4 mr-4 overflow-hidden rounded-xl"
    />
  );

  // Skeleton Kategori Item
  const SkeletonCategoryItem = () => (
    <Animated.View
      style={animatedStyle}
      className="bg-muted/20 mr-4 h-20 w-20 items-center rounded-xl p-3"
    />
  );

  // Skeleton Berita Item
  const SkeletonNewsItem = () => (
    <View className="bg-muted/20 mb-3 flex-row rounded-xl p-3">
      <Animated.View style={animatedStyle} className="bg-muted/20 mr-3 h-24 w-24 rounded-lg" />
      <View className="flex-1 justify-center">
        <Animated.View style={animatedStyle} className="bg-muted/20 mb-2 h-4 w-3/4 rounded" />
        <Animated.View style={animatedStyle} className="bg-muted/20 h-3 w-1/2 rounded" />
      </View>
    </View>
  );

  return (
    <ScreenWrapper routeName="Beranda">
      <View className="flex-1 px-4">
        {/* Header */}
        <View className="mb-4 flex-row items-center justify-between">
          <View>
            <Animated.View style={animatedStyle} className="bg-muted/20 mb-2 h-8 w-3/4 rounded" />
            <Animated.View style={animatedStyle} className="bg-muted/20 h-4 w-1/2 rounded" />
          </View>
        </View>

        {/* Trending News Skeleton */}
        <View className="mb-4">
          <Text className="mb-2 font-inter-bold text-lg">Trending Hari Ini</Text>
          <View className="flex-row">
            {[1, 2, 3].map((_, index) => (
              <SkeletonTrendingItem key={index} />
            ))}
          </View>
        </View>

        {/* News Categories Skeleton */}
        <View className="mb-4">
          <Text className="mb-2 font-inter-bold text-lg">Kategori Berita</Text>
          <View className="flex-row">
            {[1, 2, 3, 4].map((_, index) => (
              <SkeletonCategoryItem key={index} />
            ))}
          </View>
        </View>

        {/* Latest News Skeleton */}
        <View>
          <Text className="mb-2 font-inter-bold text-lg">Berita Terbaru</Text>
          {[1, 2, 3, 4].map((_, index) => (
            <SkeletonNewsItem key={index} />
          ))}
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default SkeletonHome;

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

const SkeletonNewsDetail = () => {
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

  const SkeletonHeader = () => (
    <Animated.View
      style={[animatedStyle, { width: width * 0.8, height: 250 }]}
      className="bg-muted/20 relative mb-4 rounded-xl"
    />
  );

  const SkeletonMetadata = () => (
    <View className="flex-row justify-between p-4">
      <View className="flex-1">
        <Animated.View style={animatedStyle} className="bg-muted/20 mb-2 h-6 w-3/5 rounded-md" />
        <Animated.View style={animatedStyle} className="bg-muted/20 h-4 w-2/5 rounded-md" />
      </View>
      <View className="flex-row items-center">
        <Animated.View style={animatedStyle} className="bg-muted/20 mr-2 h-6 w-6 rounded-full" />
        <Animated.View style={animatedStyle} className="bg-muted/20 h-4 w-1/2 rounded-md" />
      </View>
    </View>
  );

  const SkeletonContent = () => (
    <View className="px-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <Animated.View
          key={index}
          style={animatedStyle}
          className="bg-muted/20 mb-3 h-4 rounded-md"
        />
      ))}
    </View>
  );

  return (
    <ScreenWrapper routeName="Detail Berita">
      <View className="flex-1 p-4">
        {/* Skeleton Header */}
        <SkeletonHeader />

        {/* Skeleton Metadata */}
        <SkeletonMetadata />

        {/* Skeleton Content */}
        <SkeletonContent />
      </View>
    </ScreenWrapper>
  );
};

export default SkeletonNewsDetail;

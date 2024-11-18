import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemeToggle } from './ThemeToggle';
import { Text } from './nativewindui/Text';
import { View } from 'react-native';

type ScreenWrapperProps = {
  children: React.ReactNode;
  routeName?: string;
};

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({ children, routeName = '' }) => {
  const { top } = useSafeAreaInsets();
  const paddingTop = top > 0 ? top + 5 : 30;

  return (
    <View style={{ flex: 1, paddingTop }}>
      <View className="flex w-full flex-row items-center justify-between bg-background p-4">
        <Text variant={'heading'}>{routeName}</Text>
        <ThemeToggle />
      </View>
      {children}
    </View>
  );
};

export default ScreenWrapper;

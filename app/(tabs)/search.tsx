import { View } from 'react-native';
import React from 'react';
import ScreenWrapper from '~/components/ScreenWrapperWithNavbar';
import { Text } from '~/components/nativewindui/Text';

const SearchScreen = () => {
  return (
    <ScreenWrapper routeName="Cari Berita">
      <View>
        <Text>Search Screen</Text>
      </View>
    </ScreenWrapper>
  );
};

export default SearchScreen;

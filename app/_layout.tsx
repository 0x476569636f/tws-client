import '../global.css';
import 'expo-dev-client';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { router, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useColorScheme, useInitialAndroidBarSync } from '~/lib/useColorScheme';
import { NAV_THEME } from '~/theme';
import React, { useState, useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  Inter_100Thin,
  Inter_200ExtraLight,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  Inter_900Black,
} from '@expo-google-fonts/inter';
import { AuthProvider } from '~/context/auth';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';

import { COLORS } from '~/theme/colors';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
  const { colorScheme, isDarkColorScheme } = useColorScheme();
  const colors = colorScheme === 'dark' ? COLORS.dark : COLORS.light;

  // Load fonts
  const [fontsLoaded] = useFonts({
    Inter_100Thin,
    Inter_200ExtraLight,
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black,
  });

  // Prevent rendering until fonts are loaded
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Return null if fonts are not loaded
  if (!fontsLoaded) {
    return null;
  }

  //Toast
  const toastConfig = {
    success: (props: any) => {
      return (
        <BaseToast
          {...props}
          style={{
            borderRadius: 8,
            borderLeftColor: colors.primary,
            backgroundColor: colors.card,
          }}
          contentContainerStyle={{
            paddingHorizontal: 15,
            paddingVertical: 10,
          }}
          text1Style={{
            fontSize: 15,
            fontWeight: '400',
            fontFamily: 'Inter_500Medium',
            color: colors.foreground,
          }}
          text2Style={{
            fontSize: 13,
            fontFamily: 'Inter_400Regular',
            color: colors.foreground,
          }}
        />
      );
    },
    error: (props: any) => {
      return (
        <ErrorToast
          {...props}
          style={{
            borderRadius: 8,
            borderLeftColor: colors.destructive,
            backgroundColor: colors.card,
          }}
          text1Style={{
            fontSize: 15,
            fontWeight: '400',
            fontFamily: 'Inter_500Medium',
            color: colors.foreground,
          }}
          text2Style={{
            fontSize: 13,
            fontFamily: 'Inter_400Regular',
            color: colors.foreground,
          }}
        />
      );
    },
  };

  return (
    <>
      <StatusBar
        key={`root-status-bar-${isDarkColorScheme ? 'light' : 'dark'}`}
        style={isDarkColorScheme ? 'light' : 'dark'}
      />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <ActionSheetProvider>
            <NavThemeProvider value={NAV_THEME[colorScheme]}>
              <_layout />
              <Toast config={toastConfig} />
            </NavThemeProvider>
          </ActionSheetProvider>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </>
  );
}

const SCREEN_OPTIONS = {
  animation: 'ios', // for android
} as const;

const _layout = () => {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
};

const MainLayout = () => {
  return (
    <Stack
      screenOptions={{
        animation: 'ios',
        headerShown: false,
      }}
    />
  );
};

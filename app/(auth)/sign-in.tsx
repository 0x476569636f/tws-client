import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  Pressable,
  Dimensions,
} from 'react-native';
import React, { useState } from 'react';
import ScreenWrapper from '~/components/ScreenWrapperWithNavbar';
import { Text } from '~/components/nativewindui/Text';
import Input from '~/components/Input';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useColorScheme } from '~/lib/useColorScheme';
import { Button } from '~/components/nativewindui/Button';
import Loading from '~/components/Loading';
import Animated, {
  FadeInDown,
  FadeInUp,
  SlideInRight,
  SlideOutLeft,
} from 'react-native-reanimated';
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { usePreventDoubleNavigation } from '~/hooks/usePreventDoubleNavigation';
import { useAuth } from '~/context/auth';

// Skema validasi Yup
const schema = yup.object().shape({
  email: yup.string().required('* Email harus diisi').email('* Email tidak valid'),
  password: yup.string().required('* Password harus diisi'),
});

const SignIn = () => {
  const { isDarkColorScheme, colors } = useColorScheme();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { navigateSafely, isNavigating } = usePreventDoubleNavigation();
  const { login } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  type FormData = yup.InferType<typeof schema>;

  const onPressLogin = async (formData: FormData) => {
    const email = formData.email.trim();
    const password = formData.password.trim();
    setLoading(true);

    try {
      await login(email, password);
    } catch (error: any) {
      // For debugging purposes
      // console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-background">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
        <ScreenWrapper>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'center',
              minHeight: Dimensions.get('window').height,
            }}
            showsVerticalScrollIndicator={false}>
            <Animated.View entering={FadeInUp} className="flex flex-1 gap-4 px-6 py-4">
              <View className="mb-4 items-center">
                <Text variant="largeTitle" className="text-center font-inter-bold">
                  Masuk ke Akun
                </Text>
                <Text
                  variant="subhead"
                  className="mt-2 text-center font-inter-regular text-muted-foreground">
                  Silakan Masuk Untuk Mengakses Berita dan Motivasi Terbaru
                </Text>
              </View>

              <View
                className="bg-card/90 rounded-2xl p-6 shadow-2xl"
                style={{
                  shadowColor: isDarkColorScheme ? '#ffffff10' : '#00000020',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4.65,
                  elevation: 8,
                }}>
                {/* Email Input */}
                <Animated.View
                  entering={SlideInRight.delay(100)}
                  exiting={SlideOutLeft}
                  className="mb-4">
                  <View className="relative mb-2">
                    <Controller
                      control={control}
                      name="email"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <View>
                          <View className="absolute left-4 top-3">
                            <AntDesign
                              name="mail"
                              size={24}
                              color={isDarkColorScheme ? 'white' : 'gray'}
                            />
                          </View>
                          <Input
                            placeholder="Email"
                            containerStyle={`
                                pl-12 
                                h-[50px] 
                                ${errors.email ? 'border-destructive/60 border' : 'border-muted/30'}
                              `}
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                          />
                        </View>
                      )}
                    />
                    {errors.email && (
                      <Text className="mt-1 pl-2 font-inter-regular text-xs text-destructive">
                        {errors.email.message}
                      </Text>
                    )}
                  </View>
                </Animated.View>

                {/* Password Input */}
                <Animated.View
                  entering={SlideInRight.delay(200)}
                  exiting={SlideOutLeft}
                  className="mb-4">
                  <View className="relative mb-2">
                    <Controller
                      control={control}
                      name="password"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <View>
                          <View className="absolute left-4 top-3">
                            <AntDesign
                              name="lock"
                              size={24}
                              color={isDarkColorScheme ? 'white' : 'gray'}
                            />
                          </View>
                          <Input
                            placeholder="Password"
                            containerStyle={`
                                pl-12 
                                h-[50px] 
                                ${errors.password ? 'border-destructive/60 border' : 'border-muted/30'}
                              `}
                            secureTextEntry={!showPassword}
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            rightIcon={
                              <Pressable
                                onPress={() => setShowPassword(!showPassword)}
                                className="opacity-70 active:opacity-100">
                                <Ionicons
                                  name={showPassword ? 'eye' : 'eye-off'}
                                  size={22}
                                  color={isDarkColorScheme ? 'white' : 'gray'}
                                />
                              </Pressable>
                            }
                          />
                        </View>
                      )}
                    />
                    {errors.password && (
                      <Text className="mt-1 pl-2 font-inter-regular text-xs text-destructive">
                        {errors.password.message}
                      </Text>
                    )}
                  </View>
                </Animated.View>

                {/* Login Button */}
                <Animated.View entering={FadeInDown.delay(300)} className="mt-4">
                  <Button
                    onPress={handleSubmit(onPressLogin)}
                    disabled={loading}
                    className="shadow-md">
                    {loading ? <Loading /> : <Text className="font-inter-regular">Masuk</Text>}
                  </Button>
                </Animated.View>
              </View>

              {/* Daftar Link */}
              <Animated.View
                entering={FadeInDown.delay(400)}
                className="flex-row justify-center gap-2">
                <Text variant="subhead" className="font-inter-regular">
                  Belum punya akun?
                </Text>
                <Pressable
                  onPress={() => navigateSafely('/sign-up', 'replace')}
                  disabled={isNavigating}>
                  <Text variant="subhead" className="font-inter-semibold text-primary">
                    Daftar
                  </Text>
                </Pressable>
              </Animated.View>
            </Animated.View>
          </ScrollView>
        </ScreenWrapper>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SignIn;

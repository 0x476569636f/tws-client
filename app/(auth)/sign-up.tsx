import {
  Alert,
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
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '~/components/nativewindui/Button';
import Loading from '~/components/Loading';
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
} from 'react-native-reanimated';
import { usePreventDoubleNavigation } from '~/hooks/usePreventDoubleNavigation';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { API_URL } from '~/constant';
import { useRouter } from 'expo-router';

const schema = yup.object().shape({
  name: yup
    .string()
    .required('* Nama harus di isi')
    .min(3, 'Nama minimal 3 karakter')
    .max(20, 'Nama maksimal 20 karakter'),
  email: yup.string().required('* Email harus di isi').email('Email tidak valid'),
  password: yup
    .string()
    .required('* Password harus di isi')
    .min(8, 'Password minimal 8 karakter')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password harus mengandung huruf besar, huruf kecil, angka, dan karakter spesial'
    ),
  confirmPassword: yup
    .string()
    .required('* Konfirmasi password harus di isi')
    .oneOf([yup.ref('password')], '* Konfirmasi password tidak sama'),
});

const SignUp = () => {
  const { isDarkColorScheme } = useColorScheme();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { navigateSafely, isNavigating } = usePreventDoubleNavigation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  type FormData = yup.InferType<typeof schema>;

  const onPressSend = async (formData: FormData) => {
    const name = formData.name.trim();
    const email = formData.email.trim();
    const password = formData.password.trim();

    setLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/auth/register`,
        {
          name,
          email,
          password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );

      if (response.status == 200) {
        Toast.show({
          type: 'success',
          text1: 'Registrasi Berhasil',
          text2: 'Anda akan diarahkan ke halaman login',
          visibilityTime: 2000,
          topOffset: 60,
          onHide: async () => {
            router.replace('/sign-in');
          },
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error?.issues[0].message ||
          'Terjadi kesalahan saat mendaftar';

        Toast.show({
          type: 'error',
          text1: 'Registrasi Gagal',
          text2: errorMessage,
          visibilityTime: 3000,
          topOffset: 60,
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Registrasi Gagal',
          text2: 'Terjadi kesalahan yang tidak diketahui',
          visibilityTime: 3000,
          topOffset: 60,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const renderInputWithIcon = (
    iconName: string,
    placeholder: string,
    field: keyof FormData,
    secureTextEntry?: boolean,
    toggleSecure?: () => void
  ) => (
    <Animated.View
      entering={SlideInRight.delay(
        field === 'name' ? 100 : field === 'email' ? 200 : field === 'password' ? 300 : 400
      )}
      exiting={SlideOutLeft}
      className="mb-4">
      <View className="relative mb-2">
        <Controller
          control={control}
          name={field}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <View>
              {/* Icon Container */}
              <View className="absolute left-4 top-3">
                <AntDesign
                  name={iconName as any}
                  size={24}
                  color={isDarkColorScheme ? 'white' : 'gray'}
                />
              </View>

              <Input
                ref={ref}
                icon={null}
                placeholder={placeholder}
                secureTextEntry={secureTextEntry}
                containerStyle={`
            pl-12 
            h-[50px] 
            ${errors[field] ? 'border-destructive/60 border' : 'border-muted/30 '}
          `}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                rightIcon={
                  toggleSecure && (
                    <Pressable onPress={toggleSecure} className="opacity-70 active:opacity-100">
                      <Ionicons
                        name={secureTextEntry ? 'eye-off' : 'eye'}
                        size={22}
                        color={isDarkColorScheme ? 'white' : 'gray'}
                      />
                    </Pressable>
                  )
                }
              />
            </View>
          )}
        />

        {/* Error Message */}
        {errors[field] && (
          <Animated.Text
            entering={FadeInDown}
            exiting={FadeOut}
            className="mt-1 pl-2 font-inter-regular text-xs text-destructive">
            {errors[field]?.message}
          </Animated.Text>
        )}
      </View>
    </Animated.View>
  );

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
                  Buat Akun Baru
                </Text>
                <Text
                  variant="subhead"
                  className="mt-2 text-center font-inter-regular text-muted-foreground">
                  Bergabunglah, Temukan Inspirasi dan Informasi Setiap Hari
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
                {renderInputWithIcon('user', 'Nama Lengkap', 'name')}
                {renderInputWithIcon('mail', 'Email', 'email')}
                {renderInputWithIcon('lock', 'Password', 'password', !showPassword, () =>
                  setShowPassword(!showPassword)
                )}
                {renderInputWithIcon(
                  'lock',
                  'Konfirmasi Password',
                  'confirmPassword',
                  !showConfirmPassword,
                  () => setShowConfirmPassword(!showConfirmPassword)
                )}

                <Animated.View entering={FadeInDown.delay(500)} className="mt-4">
                  <Button
                    onPress={handleSubmit(onPressSend)}
                    disabled={loading}
                    className="shadow-md">
                    {loading ? (
                      <Loading />
                    ) : (
                      <Text className="font-inter-regular">Daftar Sekarang</Text>
                    )}
                  </Button>
                </Animated.View>
              </View>

              <Animated.View
                entering={FadeInDown.delay(600)}
                className="flex-row justify-center gap-2">
                <Text variant="subhead" className="font-inter-regular">
                  Sudah punya akun?
                </Text>
                <Pressable
                  onPress={() => navigateSafely('/sign-in', 'replace')}
                  disabled={isNavigating}>
                  <Text variant="subhead" className="font-inter-semibold text-primary">
                    Masuk
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

export default SignUp;

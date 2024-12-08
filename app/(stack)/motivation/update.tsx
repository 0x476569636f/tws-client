import React, { useState, useEffect } from 'react';
import { View, ScrollView, Platform, KeyboardAvoidingView, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Toast from 'react-native-toast-message';
import { Text } from '~/components/nativewindui/Text';
import { Button } from '~/components/nativewindui/Button';
import ScreenWrapper from '~/components/ScreenWrapperWithNavbar';
import Loading from '~/components/Loading';
import { API_URL } from '~/constant';
import { useColorScheme } from '~/lib/useColorScheme';

// Validation Schema
const motivationSchema = yup.object().shape({
  isi_motivasi: yup
    .string()
    .required('Motivasi harus diisi')
    .min(10, 'Motivasi minimal 10 karakter')
    .max(500, 'Motivasi maksimal 500 karakter'),
});

interface MotivationFormData {
  isi_motivasi: string;
}

const UpdateMotivationScreen = () => {
  const router = useRouter();
  const { colors } = useColorScheme();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const { id } = useLocalSearchParams();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(motivationSchema),
    defaultValues: {
      isi_motivasi: '',
    },
  });

  useEffect(() => {
    const fetchMotivation = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(`${API_URL}/motivations/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setValue('isi_motivasi', response.data.isi_motivasi);
        setInitialLoading(false);
      } catch (error) {
        console.error('Error fetching motivation:', error);
        Toast.show({
          type: 'error',
          text1: 'Gagal Memuat Motivasi',
          text2: 'Silakan coba lagi',
          topOffset: 60,
          visibilityTime: 2000,
        });
        router.replace('/motivation');
      }
    };

    if (id) {
      fetchMotivation();
    }
  }, [id]);

  const onSubmit = async (data: MotivationFormData) => {
    setLoading(true);

    try {
      const token = await AsyncStorage.getItem('token');

      await axios.patch(`${API_URL}/motivations/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Toast.show({
        type: 'success',
        text1: 'Motivasi Berhasil Diperbarui',
        text2: 'Motivasi Anda telah disimpan',
        topOffset: 60,
        visibilityTime: 2000,
        onHide: () => router.replace('/motivation'),
      });
    } catch (error) {
      console.error('Error updating motivation:', error);
      Toast.show({
        type: 'error',
        text1: 'Gagal Memperbarui Motivasi',
        text2: 'Silakan coba lagi',
        topOffset: 60,
        visibilityTime: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <ScreenWrapper routeName="Perbarui Motivasi">
        <Loading />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper routeName="Perbarui Motivasi">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 100 }}>
          <View className="p-4">
            {/* Input Motivasi */}
            <View className="mb-4">
              <Controller
                control={control}
                name="isi_motivasi"
                render={({ field: { onChange, value } }) => (
                  <View className="mb-4">
                    <Text
                      variant={'heading'}
                      className="mb-2 font-inter-regular text-muted-foreground">
                      Edit Motivasimu
                    </Text>
                    <TextInput
                      multiline
                      placeholder="Perbarui motivasi inspiratifmu di sini..."
                      placeholderTextColor="#888"
                      value={value}
                      onChangeText={onChange}
                      style={{
                        minHeight: 200,
                        textAlignVertical: 'top',
                        backgroundColor: colors.card,
                        color: colors.foreground,
                        padding: 12,
                        borderRadius: 8,
                        borderWidth: 1,
                        fontFamily: 'Inter_400Regular',
                        borderColor: errors.isi_motivasi ? colors.destructive : colors.grey4,
                      }}
                      className="font-inter-regular text-base"
                    />
                    {errors.isi_motivasi && (
                      <Text className="mt-1 font-inter-regular text-xs text-destructive">
                        {errors.isi_motivasi.message}
                      </Text>
                    )}
                  </View>
                )}
              />
            </View>

            {/* Tombol Submit */}
            <Button onPress={handleSubmit(onSubmit)} disabled={loading}>
              <Text className="font-inter-regular text-white">
                {loading ? 'Memperbarui...' : 'Perbarui Motivasi'}
              </Text>
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Toast />
    </ScreenWrapper>
  );
};

export default UpdateMotivationScreen;

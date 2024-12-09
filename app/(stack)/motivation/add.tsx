import React, { useState } from 'react';
import {
  View,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Toast from 'react-native-toast-message';
import { Text } from '~/components/nativewindui/Text';
import { Button } from '~/components/nativewindui/Button';
import ScreenWrapper from '~/components/ScreenWrapperWithNavbar';
import { API_URL } from '~/constant';
import { useColorScheme } from '~/lib/useColorScheme';

// Validation Schema
const motivationSchema = yup.object().shape({
  isi_motivasi: yup
    .string()
    .required('Motivasi harus diisi')
    .min(3, 'Motivasi minimal 3 karakter')
    .max(200, 'Motivasi maksimal 200 karakter'),
});

interface MotivationFormData {
  isi_motivasi: string;
}

const AddMotivationScreen = () => {
  const router = useRouter();
  const { colors } = useColorScheme();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(motivationSchema),
    defaultValues: {
      isi_motivasi: '',
    },
  });

  const onSubmit = async (data: MotivationFormData) => {
    setLoading(true);

    try {
      const user = await AsyncStorage.getItem('user');
      const { id: userId } = JSON.parse(user!);

      const payload = {
        ...data,
        userId,
      };

      const token = await AsyncStorage.getItem('token');

      await axios.post(`${API_URL}/motivations`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Toast.show({
        type: 'success',
        text1: 'Motivasi Berhasil Ditambahkan',
        text2: 'Motivasi Anda telah disimpan',
        topOffset: 60,
        visibilityTime: 2000,
        onHide: () => router.replace('/motivation'),
      });
    } catch (error) {
      console.error('Error adding motivation:', error);
      Toast.show({
        type: 'error',
        text1: 'Gagal Menambah Motivasi',
        text2: 'Silakan coba lagi',
        topOffset: 60,
        visibilityTime: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper routeName="Tambah Motivasi">
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
                      Tulis Motivasimu
                    </Text>
                    <TextInput
                      multiline
                      placeholder="Tulis motivasi inspiratifmu di sini..."
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
                {loading ? 'Menambahkan...' : 'Tambah Motivasi'}
              </Text>
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Toast />
    </ScreenWrapper>
  );
};

export default AddMotivationScreen;

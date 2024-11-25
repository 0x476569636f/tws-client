// app/(stack)/news/add.tsx
import React, { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Toast from 'react-native-toast-message';

// Komponen & Styling
import { Text } from '~/components/nativewindui/Text';
import { Button } from '~/components/nativewindui/Button';
import Input from '~/components/Input';
import ScreenWrapper from '~/components/ScreenWrapperWithNavbar';
import Loading from '~/components/Loading';

// Icons
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';

// Konstanta & Utilities
import { API_URL } from '~/constant';
import { useColorScheme } from '~/lib/useColorScheme';
import { supabase } from '~/lib/supabase';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';

// Skema Validasi
const newsSchema = yup.object().shape({
  judul: yup
    .string()
    .required('Judul berita harus diisi')
    .min(10, 'Judul minimal 10 karakter')
    .max(100, 'Judul maksimal 100 karakter'),
  isi: yup.string().required('Konten berita harus diisi').min(10, 'Konten minimal 10 karakter'),
  kategoriId: yup.number().required('Kategori harus dipilih'),
});

// Tipe Data
interface NewsFormData {
  judul: string;
  isi: string;
  kategoriId: number;
}

export const uploadFile = async (folderName: string, fileUri: string, isImage = true) => {
  try {
    let fileName = `${folderName}/${Date.now()}.${isImage ? 'jpg' : 'mp4'}`;
    const fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    const imageData = decode(fileBase64);

    const { data, error } = await supabase.storage.from('images').upload(fileName, imageData, {
      contentType: isImage ? 'image/*' : 'video/*',
      cacheControl: '3600',
      upsert: false,
    });

    if (error) {
      console.error('Supabase upload error:', error);
      return { success: false, msg: error.message };
    }

    // Dapatkan URL publik
    const { data: publicUrlData } = supabase.storage.from('images').getPublicUrl(fileName);

    return {
      success: true,
      data: publicUrlData.publicUrl,
    };
  } catch (error: any) {
    console.error('Upload file error:', error);
    return { success: false, msg: 'Error when uploading media' };
  }
};

const AddNewsScreen = () => {
  const router = useRouter();
  const { colors } = useColorScheme();
  const [loading, setLoading] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [categories, setCategories] = useState<{ id: number; namaKategori: string }[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Form Handler
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(newsSchema),
    defaultValues: {
      judul: '',
      isi: '',
      kategoriId: undefined,
    },
  });

  // Fetch Kategori
  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(`${API_URL}/news-category`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories(response.data);
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Gagal memuat kategori',
          text2: 'Silakan coba lagi',
        });
      }
    };

    fetchCategories();
  }, []);

  // Pilih Gambar
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Toast.show({
        type: 'error',
        text1: 'Gagal memilih gambar',
      });
    }
  };

  // Submit Berita
  const onSubmit = async (data: NewsFormData) => {
    if (!imageUri) {
      Toast.show({
        type: 'error',
        text1: 'Gambar Berita',
        text2: 'Silakan pilih gambar terlebih dahulu',
        topOffset: 60,
        visibilityTime: 2000,
      });
      return;
    }

    setLoading(true);
    setIsUploading(true);

    try {
      const uploadResult = await uploadFile('news', imageUri);

      if (!uploadResult.success) {
        Toast.show({
          type: 'error',
          text1: 'Gagal upload gambar',
          text2: uploadResult.msg,
        });
        setIsUploading(false);
        return;
      }
      const user = await AsyncStorage.getItem('user');
      const { id } = JSON.parse(user!);

      const payload = {
        ...data,
        userId: id,
        image: uploadResult.data, // URL gambar dari Supabase
      };

      // Dapatkan token
      const token = await AsyncStorage.getItem('token');

      // Kirim data berita ke API
      const response = await axios.post(`${API_URL}/news`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Toast.show({
        type: 'success',
        text1: 'Berita Berhasil Ditambahkan',
        text2: 'Berita Anda sedang diproses',
        onHide: () => router.replace('/home'),
      });
    } catch (error) {
      console.error('Error adding news:', error);
      Toast.show({
        type: 'error',
        text1: 'Gagal Menambah Berita',
        text2: 'Silakan coba lagi',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 100 }}>
          <View className="p-4">
            {/* Judul Halaman */}
            <Text variant="title2" className="mb-4 font-inter-bold">
              Tambah Berita Baru
            </Text>

            {/* Input Judul */}
            <View className="mb-4">
              <Controller
                control={control}
                name="judul"
                render={({ field: { onChange, value } }) => (
                  <Input
                    placeholder="Judul Berita"
                    value={value}
                    onChangeText={onChange}
                    containerStyle={errors.judul ? 'border-destructive' : ''}
                  />
                )}
              />
              {errors.judul && (
                <Text className="mt-1 font-inter-regular text-xs text-destructive">
                  {errors.judul.message}
                </Text>
              )}
            </View>

            {/* Pilih Kategori */}
            <View className="mb-4">
              <Controller
                control={control}
                name="kategoriId"
                render={({ field: { onChange, value } }) => (
                  <View className="border-muted/30 rounded-md border p-2">
                    <Text className="mb-2 font-inter-regular text-muted-foreground">
                      Pilih Kategori
                    </Text>
                    <View className="flex-row flex-wrap">
                      {categories.map((category) => (
                        <TouchableOpacity
                          key={category.id}
                          onPress={() => setValue('kategoriId', category.id)}
                          className={`
                            m-1 rounded p-2 font-inter-regular
                            ${value === category.id ? 'bg-primary text-white' : 'bg-muted/10'}
                          `}>
                          <Text>{category.namaKategori}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}
              />
              {errors.kategoriId && (
                <Text className="mt-1 font-inter-regular text-xs text-destructive">
                  {errors.kategoriId.message}
                </Text>
              )}
            </View>

            {/* Input Isi Berita */}
            <View className="mb-4">
              <Controller
                control={control}
                name="isi"
                render={({ field: { onChange, value } }) => (
                  <View className="mb-4">
                    <Text className="mb-2 font-inter-regular text-muted-foreground">
                      Isi Berita
                    </Text>
                    <TextInput
                      multiline
                      placeholder="Tulis isi berita di sini..."
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
                        borderColor: errors.isi ? colors.destructive : colors.grey4,
                      }}
                      className="font-inter-regular text-base"
                    />
                    {errors.isi && (
                      <Text className="mt-1 font-inter-regular text-xs text-destructive">
                        {errors.isi.message}
                      </Text>
                    )}
                  </View>
                )}
              />
            </View>

            {/* Pilih Gambar */}
            <TouchableOpacity onPress={pickImage} className="mb-4">
              <View className="border-muted/30 rounded-md border-2 border-dashed p-4">
                {imageUri ? (
                  <Image
                    source={{ uri: imageUri }}
                    style={{ width: '100%', height: 200, borderRadius: 8 }}
                  />
                ) : (
                  <Text className="text-center font-inter-regular text-muted-foreground">
                    Pilih Gambar Berita
                  </Text>
                )}
              </View>
            </TouchableOpacity>

            {/* Tombol Submit */}
            <Button onPress={handleSubmit(onSubmit)} disabled={loading}>
              <Text className="font-inter-regular text-white">
                {loading ? 'Menambahkan...' : 'Tambah Berita'}
              </Text>
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      {loading && <Loading />}
      <Toast />
    </ScreenWrapper>
  );
};

export default AddNewsScreen;

import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { router } from 'expo-router';
import { API_URL } from '~/constant';
import Toast from 'react-native-toast-message';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  setAuth: (authUser: User | null) => void;
  setUserData: (userdata: Partial<User>) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setAuth: () => {},
  setUserData: () => {},
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        router.replace('/home');
      } else {
        router.replace('/welcome');
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
      router.replace('/welcome');
    }
  };

  const setAuth = (authUser: User | null) => {
    setUser(authUser);
  };

  const setUserData = (userdata: Partial<User>) => {
    setUser((prevUser) => ({ ...prevUser, ...userdata }) as User);
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(
        `${API_URL}/auth/login`,
        {
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

      if (response.data) {
        const { user, token } = response.data;
        Toast.show({
          type: 'success',
          text1: 'Login Berhasil',
          text2: 'Anda akan diarahkan ke halaman beranda',
          visibilityTime: 2000,
          topOffset: 60,
          onHide: async () => {
            await AsyncStorage.setItem('user', JSON.stringify(user));
            await AsyncStorage.setItem('token', token);
            setUser(user);
            router.replace('/home');
          },
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Login Gagal',
        text2: 'Periksa kembali email dan password anda',
        visibilityTime: 3000,
        autoHide: true,
        topOffset: 60,
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      Toast.show({
        type: 'success',
        text1: 'Logout Berhasil',
        text2: 'Sampai jumpa lagi',
        visibilityTime: 2000,
        topOffset: 60,
        onHide: async () => {
          await AsyncStorage.removeItem('user');
          await AsyncStorage.removeItem('token');
          setUser(null);
          router.replace('/welcome');
        },
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Logout Gagal',
        text2: 'Silahkan coba lagi',
        visibilityTime: 3000,
        autoHide: true,
      });
      console.error('Logout error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, setAuth, setUserData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

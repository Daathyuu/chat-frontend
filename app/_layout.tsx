import { echo } from '@/lib/echo';
import { initPinLock } from '@/lib/pinLock';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';

export default function RootLayout() {

  const [ready, setReady] = useState(false);
  useEffect(() => {
     AsyncStorage.removeItem('pin_unlocked')
    initPinLock()
  }, [])
  useEffect(() => {
    AsyncStorage.getItem('token').then((token) => {
      // console.log('TOKEN:', token);
      if (!token) return;

      echo.options.auth ??= { headers: {} };
      echo.options.auth.headers.Authorization = `Bearer ${token}`;

      console.log('TOKEN READY');

      echo.connect();
      echo.connector.pusher.connection.bind('connected', () => {
        console.log('SOCKET CONNECTED');
        setReady(true);
      });
    });
  }, []);

  if (!ready) return null; // 🔥 TOKEN бэлэн болтол route-ууд ачаалахгүй
  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="invite" />
        <Stack.Screen name="pin-setup" />
        <Stack.Screen name="pin" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="dancer" />
        <Stack.Screen name="chat" />
        <Stack.Screen
          name="modal"
          options={{ presentation: 'modal' }}
        />
      </Stack>

      {/* Light theme-д тохирсон status bar */}
      <StatusBar style="dark" />
    </ThemeProvider>
  );
}

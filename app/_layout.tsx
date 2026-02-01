import {
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
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

      <StatusBar style="dark" />
    </ThemeProvider>
  );
}

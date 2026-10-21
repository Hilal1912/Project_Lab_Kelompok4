import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import '../global.css'; // Sesuaikan path ini dengan letak file global.css kamu
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(admin)" />
    </Stack>
  );
}

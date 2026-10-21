import '../../global.css';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CartProvider } from '@/context/cart-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <CartProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(admin)" />
        </Stack>
      </CartProvider>
    </SafeAreaProvider>
  );
}

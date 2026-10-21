import { Stack } from 'expo-router';
import '../global.css';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CartProvider } from '@/context/cart-context';
import { MenuProvider } from '@/context/menu-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <CartProvider>
        <MenuProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="admin" />
          </Stack>
        </MenuProvider>
      </CartProvider>
    </SafeAreaProvider>
  );
}
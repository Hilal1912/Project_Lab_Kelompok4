import { Stack } from 'expo-router';
import '../global.css';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CartProvider } from '@/context/cart-context';
import { MenuProvider } from '@/context/menu-context';
import { AuthProvider } from '@/context/auth-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <CartProvider>
          <MenuProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="admin" />
            </Stack>
          </MenuProvider>
        </CartProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
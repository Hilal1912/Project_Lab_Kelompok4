import { Stack } from 'expo-router';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function AdminLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="detail-menu" />
      <Stack.Screen name="edit-menu" />
      <Stack.Screen name="detail-pesanan" />
      <Stack.Screen name="tambah-menu" />
    </Stack>
  );
}

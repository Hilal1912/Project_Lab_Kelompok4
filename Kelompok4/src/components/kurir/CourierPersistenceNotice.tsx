import { Text, View } from 'react-native';

interface CourierPersistenceNoticeProps {
  isHydrated: boolean;
  error: string | null;
}

export default function CourierPersistenceNotice({
  isHydrated,
  error,
}: CourierPersistenceNoticeProps) {
  if (!isHydrated) {
    return (
      <View className="mb-3 rounded-lg bg-white/70 px-3 py-2">
        <Text className="text-[9px] text-slate-500">Memuat data tersimpan...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View accessibilityRole="alert" className="mb-3 rounded-lg bg-amber-100 px-3 py-2">
        <Text className="text-[9px] text-amber-900">{error}</Text>
      </View>
    );
  }

  return null;
}

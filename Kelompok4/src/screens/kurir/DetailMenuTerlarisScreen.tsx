import { Feather, Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import ScreenWrapper from '../../components/layout/ScreenWrapper';
import CourierBottomTabs from '../../components/kurir/CourierBottomTabs';

const menuInfo: Record<string, { price: number; category: string; description: string; contents: string }> = {
  'Nasi Bakar Ayam': {
    price: 20000,
    category: 'Makanan',
    description: 'Nasi berbumbu dengan ayam suwir dan daun kemangi, dibungkus daun pisang lalu dibakar hingga harum.',
    contents: '1 nasi bakar ayam, sambal, dan lalapan',
  },
  'Nasi Bakar Cumi': {
    price: 22000,
    category: 'Makanan',
    description: 'Nasi bakar gurih berisi cumi berbumbu dengan sambal khas dan daun kemangi segar.',
    contents: '1 nasi bakar cumi, sambal, dan lalapan',
  },
  'Es Teh Manis': {
    price: 5000,
    category: 'Minuman',
    description: 'Teh pilihan yang diseduh segar dan disajikan dingin dengan rasa manis yang pas.',
    contents: '1 gelas es teh manis',
  },
};

function money(amount: number) {
  return `Rp${amount.toLocaleString('id-ID')}`;
}

export default function DetailMenuTerlarisScreen() {
  const { name } = useLocalSearchParams<{ name?: string }>();
  const router = useRouter();
  const menuName = name ?? 'Nasi Bakar Ayam';
  const item = menuInfo[menuName] ?? menuInfo['Nasi Bakar Ayam'];

  return (
    <ScreenWrapper className="flex-1 bg-[#fbf8f0]" style={{ width: '100%', maxWidth: 430, alignSelf: 'center' }}>
      <View className="h-14 flex-row items-center gap-3 px-5">
        <TouchableOpacity accessibilityRole="button" onPress={() => router.back()}>
          <Feather name="arrow-left" size={19} color="#202a27" />
        </TouchableOpacity>
        <Text className="text-[16px] font-semibold text-[#202a27]">Detail Menu Terlaris</Text>
      </View>
      <ScrollView className="flex-1 px-4 pt-2" contentContainerStyle={{ paddingBottom: 20 }}>
        <View className="mb-3 rounded-xl border border-stone-200 bg-white/80 p-4">
          <View className="mb-3 flex-row items-center gap-2">
            <Ionicons name="flame-outline" size={16} color="#176044" />
            <View className="rounded-full bg-emerald-100 px-2 py-1">
              <Text className="text-[10px] text-emerald-800">Menu Terlaris</Text>
            </View>
          </View>
          <Text className="text-[17px] font-semibold text-[#202a27]">{menuName}</Text>
          <Text className="mt-2 text-[12px] leading-5 text-slate-500">{item.description}</Text>
          <View className="mt-4 flex-row justify-between">
            <Text className="text-[11px] text-slate-400">Harga per porsi</Text>
            <Text className="text-[12px] font-semibold text-[#202a27]">{money(item.price)}</Text>
          </View>
          <View className="mt-2 flex-row justify-between">
            <Text className="text-[11px] text-slate-400">Kategori</Text>
            <Text className="text-[12px] text-[#202a27]">{item.category}</Text>
          </View>
        </View>
        <View className="mb-3 rounded-xl border border-stone-200 bg-white/80 p-4">
          <Text className="mb-2 text-[14px] font-semibold text-[#202a27]">Informasi Kemasan</Text>
          <Text className="text-[12px] leading-5 text-slate-500">Isi per porsi</Text>
          <Text className="mt-1 text-[12px] text-[#202a27]">{item.contents}</Text>
          <Text className="mb-1 mt-3 text-[12px] leading-5 text-slate-500">Perkiraan persiapan</Text>
          <Text className="text-[12px] text-[#202a27]">15–20 menit</Text>
        </View>
        <View className="mb-4 rounded-xl border border-stone-200 bg-white/80 p-4">
          <Text className="mb-2 text-[14px] font-semibold text-[#202a27]">Catatan untuk Kurir</Text>
          <Text className="text-[12px] leading-5 text-slate-500">
            Jaga kotak tetap rata dan tertutup. Pisahkan dari minuman agar makanan tetap hangat dan tidak tumpah selama perjalanan.
          </Text>
        </View>
        <Text className="mb-3 text-[11px] leading-4 text-slate-500">
          Informasi menu untuk kurir. Pemesanan tidak tersedia pada halaman ini.
        </Text>
        <TouchableOpacity
          accessibilityRole="button"
          onPress={() => router.replace('/')}
          className="items-center rounded-lg border border-emerald-800 py-3"
        >
          <Text className="text-[12px] font-medium text-emerald-800">Kembali ke Pesanan Saya</Text>
        </TouchableOpacity>
      </ScrollView>
      <CourierBottomTabs activeTab="orders" />
    </ScreenWrapper>
  );
}

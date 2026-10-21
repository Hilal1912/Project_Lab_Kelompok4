import { Feather, Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import ScreenWrapper from '../layout/ScreenWrapper';
import CourierBottomTabs from './CourierBottomTabs';
import CourierPersistenceNotice from './CourierPersistenceNotice';
import { useCourierData } from '../../state/courier-orders';

interface CourierOrderSuccessScreenProps {
  variant: 'picked-up' | 'completed';
}

export default function CourierOrderSuccessScreen({
  variant,
}: CourierOrderSuccessScreenProps) {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { orders, history, isHydrated, persistenceError } = useCourierData();
  const router = useRouter();
  const order = [...orders, ...history].find((item) => item.id === id);
  const isCompleted = variant === 'completed';
  const title = isCompleted ? 'Pengantaran Berhasil Diselesaikan' : 'Pesanan Berhasil Diambil';
  const description = isCompleted
    ? 'Terima kasih! Pesanan telah diterima dan tersimpan di riwayat pengantaran.'
    : 'Pesanan telah masuk ke Dalam Proses. Silakan ambil pesanan di dapur.';

  return (
    <ScreenWrapper
      className="flex-1 bg-[#fbf8f0]"
      style={{ width: '100%', maxWidth: 430, alignSelf: 'center' }}
    >
      <View className="h-14 flex-row items-center gap-3 px-5">
        <TouchableOpacity
          accessibilityRole="button"
          onPress={() => router.replace(isCompleted ? '/riwayat-pengantaran' : '/')}
        >
          <Feather name="arrow-left" size={19} color="#202a27" />
        </TouchableOpacity>
        <Text className="text-[16px] font-semibold text-[#202a27]">
          {isCompleted ? 'Pengantaran Selesai' : 'Pesanan Diambil'}
        </Text>
      </View>
      <View className="flex-1 px-4 pt-6">
        <CourierPersistenceNotice isHydrated={isHydrated} error={persistenceError} />
        <View className="mb-5 items-center">
          <View className="mb-3 h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <Ionicons name="checkmark-circle-outline" size={36} color="#176044" />
          </View>
          <Text className="text-center text-[17px] font-semibold text-[#202a27]">{title}</Text>
          <Text className="mt-2 text-center text-[12px] leading-5 text-slate-500">{description}</Text>
        </View>

        {order ? (
          <View className="rounded-xl border border-stone-200 bg-white/80 p-4">
            <View className="mb-3 flex-row items-center justify-between">
              <View>
                <Text className="text-[14px] font-semibold text-[#202a27]">#{order.id}</Text>
                <Text className="mt-1 text-[11px] text-slate-500">
                  {order.dateTime} · Pengantaran
                </Text>
              </View>
              <View className="rounded-full bg-emerald-100 px-2 py-1">
                <Text className="text-[10px] font-medium text-emerald-800">
                  {isCompleted ? 'Selesai' : 'Dalam Proses'}
                </Text>
              </View>
            </View>
            {isCompleted ? (
              <>
                <Text className="mb-1 text-[11px] text-slate-400">Diterima oleh</Text>
                <Text className="mb-3 text-[13px] text-[#202a27]">{order.customer}</Text>
                <Text className="mb-1 text-[11px] text-slate-400">Alamat pengantaran</Text>
                <Text className="mb-3 text-[13px] text-[#202a27]">{order.address}</Text>
                <Text className="mb-1 text-[11px] text-slate-400">Pembayaran tunai</Text>
                <Text className="text-[13px] font-semibold text-[#202a27]">{order.paymentStatus}</Text>
              </>
            ) : (
              <>
                <Text className="mb-1 text-[11px] text-slate-400">Lokasi pengambilan</Text>
                <Text className="mb-3 text-[13px] text-[#202a27]">
                  Dapur Nasi Bakar · Jl. Cangkring No. 5, Cirebon
                </Text>
                <Text className="mb-1 text-[11px] text-slate-400">Penerima</Text>
                <Text className="mb-3 text-[13px] text-[#202a27]">{order.customer}</Text>
                <Text className="mb-1 text-[11px] text-slate-400">Alamat tujuan</Text>
                <Text className="text-[13px] text-[#202a27]">{order.address}</Text>
              </>
            )}
          </View>
        ) : (
          <View className="rounded-xl border border-stone-200 bg-white/80 p-4">
            <Text className="text-[13px] text-slate-500">
              Rincian pesanan #{id ?? '-'} tidak ditemukan.
            </Text>
          </View>
        )}

        <TouchableOpacity
          accessibilityRole="button"
          onPress={() => router.replace(isCompleted ? '/riwayat-pengantaran' : '/')}
          className="mt-4 items-center rounded-lg bg-emerald-800 py-3"
        >
          <Text className="text-[13px] font-semibold text-white">
            {isCompleted ? 'Lihat Riwayat' : 'Lihat Pesanan'}
          </Text>
        </TouchableOpacity>
      </View>
      <CourierBottomTabs activeTab={isCompleted ? 'history' : 'orders'} />
    </ScreenWrapper>
  );
}

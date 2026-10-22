import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ScreenWrapper from '../../components/layout/ScreenWrapper';
import CourierBottomTabs from '../../components/kurir/CourierBottomTabs';
import CourierPersistenceNotice from '../../components/kurir/CourierPersistenceNotice';
import {
  CourierOrder,
  updateCourierOrderStatus,
  useCourierData,
} from '../../state/courier-orders';

const statusLabels: Record<CourierOrder['status'], string> = {
  antrian: 'Dalam Antrian',
  proses: 'Dalam Proses',
  perjalanan: 'Dalam Perjalanan',
  selesai: 'Selesai',
};

const timelineLabels = [
  { key: 'antrian', label: 'Pesanan masuk', time: '10:25' },
  { key: 'proses', label: 'Dalam Proses', time: '10:45' },
  { key: 'perjalanan', label: 'Dalam Perjalanan', time: '11:20' },
  { key: 'selesai', label: 'Selesai', time: '11:40' },
] as const;

function money(amount: number) {
  return `Rp${amount.toLocaleString('id-ID')}`;
}

function OrderInformation({ order }: { order: CourierOrder }) {
  return (
    <View className="rounded-xl border border-stone-200 bg-white/80 p-4">
      <Text className="mb-3 text-[14px] font-semibold text-[#202a27]">
        Informasi Pengantaran
      </Text>
      <Text className="mb-1 text-[11px] text-slate-400">Lokasi pengambilan</Text>
      <Text className="mb-3 text-[13px] leading-5 text-[#202a27]">
        Dapur Nasi Bakar · Jl. Cangkring No. 5, Cirebon
      </Text>
      <Text className="mb-1 text-[11px] text-slate-400">Penerima</Text>
      <Text className="mb-3 text-[13px] text-[#202a27]">
        {order.customer} · 0812 3456 7890
      </Text>
      <Text className="mb-1 text-[11px] text-slate-400">Alamat tujuan</Text>
      <Text className="text-[13px] leading-5 text-[#202a27]">{order.address}</Text>
    </View>
  );
}

function OrderSummary({ order }: { order: CourierOrder }) {
  const subtotal = order.items.reduce(
    (total, item) => total + item.quantity * item.unitPrice,
    0,
  );

  return (
    <View className="mt-3 rounded-xl border border-stone-200 bg-white/80 p-4">
      <Text className="mb-3 text-[14px] font-semibold text-[#202a27]">Rincian Pesanan</Text>
      {order.items.map((item) => (
        <View key={item.name} className="mb-2 flex-row justify-between gap-3">
          <Text className="flex-1 text-[12px] text-slate-500">
            {item.quantity} × {item.name}
          </Text>
          <Text className="text-[12px] text-[#202a27]">
            {money(item.quantity * item.unitPrice)}
          </Text>
        </View>
      ))}
      <View className="mb-2 flex-row justify-between">
        <Text className="text-[12px] text-slate-500">Ongkos kirim</Text>
        <Text className="text-[12px] text-[#202a27]">{money(order.deliveryFee)}</Text>
      </View>
      <View className="mt-1 flex-row justify-between border-t border-stone-200 pt-2">
        <Text className="text-[12px] font-semibold text-[#202a27]">Total · {order.paymentStatus}</Text>
        <Text className="text-[12px] font-semibold text-[#202a27]">
          {money(subtotal + order.deliveryFee)}
        </Text>
      </View>
    </View>
  );
}

function OrderTimeline({ status }: { status: CourierOrder['status'] }) {
  const activeIndex = timelineLabels.findIndex((item) => item.key === status);

  return (
    <View className="mt-3 rounded-xl border border-stone-200 bg-white/80 p-4">
      <Text className="mb-3 text-[14px] font-semibold text-[#202a27]">Alur Pesanan</Text>
      {timelineLabels.map((step, index) => {
        const isComplete = index <= activeIndex;
        const isActive = index === activeIndex;
        return (
          <View key={step.key} className="flex-row items-center gap-3 py-1.5">
            <Ionicons
              name={isComplete ? (isActive ? 'radio-button-on' : 'checkmark-circle') : 'ellipse-outline'}
              size={18}
              color={isComplete ? '#176044' : '#c6ccc8'}
            />
            <Text className={`flex-1 text-[12px] ${isComplete ? 'text-[#202a27]' : 'text-slate-400'}`}>
              {step.label}
            </Text>
            <Text className="text-[11px] text-slate-400">
              {isComplete ? step.time : 'Belum'}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

export default function DetailPesananScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { orders, history, isHydrated, persistenceError } = useCourierData();
  const [isConfirming, setIsConfirming] = useState(false);
  const order = [...orders, ...history].find((item) => item.id === id);
  const isHistory = order?.status === 'selesai';
  const actionLabel =
    order?.status === 'antrian'
      ? 'Ambil'
      : order?.status === 'proses'
        ? 'Mulai Antar'
        : order?.status === 'perjalanan'
          ? 'Selesaikan'
          : undefined;
  const confirmationTitle =
    order?.status === 'antrian'
      ? 'Ambil pesanan?'
      : order?.status === 'proses'
        ? 'Mulai antar pesanan?'
        : 'Selesaikan pengantaran?';
  const confirmationDescription =
    order?.status === 'antrian'
      ? `Pesanan #${order.id} akan menjadi tanggung jawab Anda dan masuk ke Dalam Proses.`
      : order?.status === 'proses'
        ? `Pastikan pesanan #${order.id} sudah siap. Status akan berubah menjadi Dalam Perjalanan.`
        : `Pastikan pesanan #${order?.id} sudah diterima dan pembayaran tunai telah ditangani.`;
  const orderTotal = order
    ? order.items.reduce((total, item) => total + item.quantity * item.unitPrice, order.deliveryFee)
    : 0;

  function confirmStatusChange() {
    if (!order) return;
    const currentStatus = order.status;
    updateCourierOrderStatus(order.id);
    setIsConfirming(false);

    if (currentStatus === 'antrian') {
      router.replace({ pathname: '/pesanan-diambil', params: { id: order.id } });
    } else if (currentStatus === 'perjalanan') {
      router.replace({ pathname: '/pengantaran-selesai', params: { id: order.id } });
    }
  }

  if (!order) {
    return (
      <ScreenWrapper className="flex-1 bg-[#fbf8f0]" style={{ width: '100%', maxWidth: 430, alignSelf: 'center' }}>
        <View className="h-14 flex-row items-center gap-3 px-5">
          <TouchableOpacity accessibilityRole="button" onPress={() => router.back()}>
            <Feather name="arrow-left" size={20} color="#202a27" />
          </TouchableOpacity>
          <Text className="text-[16px] font-semibold text-[#202a27]">Detail Pesanan</Text>
        </View>
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-center text-[14px] text-slate-500">
            Pesanan ini tidak ditemukan.
          </Text>
          <TouchableOpacity onPress={() => router.replace(isHistory ? '/riwayat-pengantaran' : '/')}>
            <Text className="mt-4 text-[13px] font-semibold text-emerald-800">Kembali</Text>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      className="flex-1 bg-[#fbf8f0]"
      style={{ width: '100%', maxWidth: 430, alignSelf: 'center' }}
    >
      <View className="h-14 flex-row items-center gap-3 px-5">
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Kembali"
          onPress={() => {
            if (router.canGoBack()) router.back();
            else router.replace(isHistory ? '/riwayat-pengantaran' : '/');
          }}
        >
          <Feather name="arrow-left" size={20} color="#202a27" />
        </TouchableOpacity>
        <Text className="text-[16px] font-semibold text-[#202a27]">
          {isHistory ? 'Detail Riwayat' : 'Detail Pesanan'}
        </Text>
      </View>

      <ScrollView className="flex-1 px-4 pb-5 pt-2" showsVerticalScrollIndicator={false}>
        <CourierPersistenceNotice isHydrated={isHydrated} error={persistenceError} />
        <View className="mb-3 flex-row items-center justify-between">
          <View>
            <Text className="text-[15px] font-semibold text-[#202a27]">#{order.id}</Text>
            <Text className="mt-1 text-[11px] text-slate-500">
              {order.dateTime} · Pengantaran
            </Text>
          </View>
          <View className="rounded-full bg-emerald-100 px-2.5 py-1">
            <Text className="text-[10px] font-medium text-emerald-800">
              {statusLabels[order.status]}
            </Text>
          </View>
        </View>
        <View className="mb-3 flex-row items-center gap-2">
          <MaterialCommunityIcons name="bike" size={17} color="#176044" />
          <Text className="text-[12px] text-[#202a27]">Pengantaran kurir</Text>
        </View>
        <OrderInformation order={order} />
        <OrderSummary order={order} />
        <OrderTimeline status={order.status} />
        {isHistory && (
          <View className="mt-3 rounded-xl bg-emerald-50 px-4 py-3">
            <Text className="text-[12px] text-emerald-900">
              Kurir · Ahmad Fauzi (K001)
            </Text>
            <Text className="mt-1 text-[12px] text-emerald-900">
              Pembayaran tunai · {order.paymentStatus}
            </Text>
          </View>
        )}
        {actionLabel && (
          <TouchableOpacity
            accessibilityRole="button"
            disabled={!isHydrated}
            onPress={() => setIsConfirming(true)}
            className="mt-4 items-center rounded-lg bg-emerald-800 py-3.5"
          >
            <Text className="text-[14px] font-semibold text-white">{actionLabel}</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <CourierBottomTabs activeTab={isHistory ? 'history' : 'orders'} />

      <Modal
        visible={isConfirming}
        transparent
        animationType="fade"
        onRequestClose={() => setIsConfirming(false)}
      >
        <View className="flex-1 justify-center bg-black/35 px-6">
          <View className="rounded-2xl bg-[#fbf8f0] p-5">
            <Text className="mb-3 text-[16px] font-semibold text-[#202a27]">
              {confirmationTitle}
            </Text>
            <Text className="mb-4 text-[13px] leading-5 text-slate-500">
              {confirmationDescription}
            </Text>
            <View className="mb-4 rounded-lg bg-white p-3">
              <Text className="text-[12px] font-medium text-[#202a27]">
                #{order.id} · {statusLabels[order.status]}
              </Text>
              <Text className="mt-1 text-[11px] text-slate-500">
                {order.customer} · {order.address}
              </Text>
              <View className="mt-2 flex-row justify-between border-t border-stone-200 pt-2">
                <Text className="text-[11px] text-slate-500">Total pesanan</Text>
                <Text className="text-[11px] font-semibold text-[#202a27]">
                  {money(orderTotal)}
                </Text>
              </View>
            </View>
            <View className="flex-row gap-2">
              <TouchableOpacity
                accessibilityRole="button"
                onPress={() => setIsConfirming(false)}
                className="flex-1 items-center rounded-lg border border-emerald-800 py-3"
              >
                <Text className="text-[13px] font-medium text-emerald-900">Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                accessibilityRole="button"
                onPress={confirmStatusChange}
                className="flex-1 items-center rounded-lg bg-emerald-800 py-3"
              >
                <Text className="text-[13px] font-semibold text-white">
                  Ya, {actionLabel}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenWrapper>
  );
}

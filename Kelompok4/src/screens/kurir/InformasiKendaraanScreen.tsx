import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ScreenWrapper from '../../components/layout/ScreenWrapper';
import CourierBottomTabs from '../../components/kurir/CourierBottomTabs';
import { supabase } from '../../lib/supabase';
import { getKendaraanKurir, updateKendaraanKurir } from '../../lib/courier-service';
import type { DbKendaraan } from '../../lib/supabase-types';

export default function InformasiKendaraanScreen() {
  const router = useRouter();
  const [kendaraan, setKendaraan] = useState<DbKendaraan | null>(null);
  const [draft, setDraft] = useState<Partial<DbKendaraan>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const data = await getKendaraanKurir(user.id);
      setKendaraan(data);
      setLoading(false);
    };
    load().catch((e) => {
      Alert.alert('Error', e.message);
      setLoading(false);
    });
  }, []);

  const jenis = draft.jenis ?? kendaraan?.jenis ?? '';
  const merekModel = draft.merek_model ?? kendaraan?.merek_model ?? '';
  const warna = draft.warna ?? kendaraan?.warna ?? '';
  const platNomor = draft.plat_nomor ?? kendaraan?.plat_nomor ?? '';

  const handleSimpan = async () => {
    if (!jenis.trim() || !merekModel.trim() || !warna.trim() || !platNomor.trim()) {
      setError('Semua informasi kendaraan wajib diisi.');
      return;
    }
    if (!kendaraan) {
      setError('Kendaraan tidak ditemukan. Hubungi admin.');
      return;
    }
    setSaving(true);
    try {
      await updateKendaraanKurir(kendaraan.id, {
        jenis: jenis.trim(),
        merek_model: merekModel.trim(),
        warna: warna.trim(),
        plat_nomor: platNomor.trim().toUpperCase(),
      });
      Alert.alert('Berhasil', 'Data kendaraan berhasil disimpan.', [
        { text: 'OK', onPress: () => router.replace('/detail-profil-kurir') },
      ]);
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setSaving(false);
    }
  };

  const fields = [
    {
      label: 'Jenis kendaraan',
      value: jenis,
      onChangeText: (v: string) => setDraft((c) => ({ ...c, jenis: v })),
    },
    {
      label: 'Merek dan tipe',
      value: merekModel,
      onChangeText: (v: string) => setDraft((c) => ({ ...c, merek_model: v })),
    },
    {
      label: 'Warna',
      value: warna,
      onChangeText: (v: string) => setDraft((c) => ({ ...c, warna: v })),
    },
    {
      label: 'Nomor polisi',
      value: platNomor,
      onChangeText: (v: string) => setDraft((c) => ({ ...c, plat_nomor: v })),
    },
  ];

  return (
    <ScreenWrapper className="flex-1 bg-[#fbf8f0]" style={{ width: '100%', maxWidth: 430, alignSelf: 'center' }}>
      <View className="h-14 flex-row items-center gap-3 px-5">
        <TouchableOpacity accessibilityRole="button" onPress={() => router.back()}>
          <Feather name="arrow-left" size={19} color="#202a27" />
        </TouchableOpacity>
        <Text className="text-[16px] font-semibold text-[#202a27]">Informasi Kendaraan</Text>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#176044" />
        </View>
      ) : (
        <ScrollView className="flex-1 px-4 pt-2" contentContainerStyle={{ paddingBottom: 20 }}>
          {/* Header kendaraan */}
          <View className="mb-3 flex-row items-center rounded-xl border border-stone-200 bg-white/80 p-4">
            <Feather name="truck" size={20} color="#176044" />
            <View className="ml-3 flex-1">
              <Text className="text-[13px] font-medium text-[#202a27]">
                {kendaraan ? kendaraan.merek_model : 'Belum ada kendaraan'}
              </Text>
              <Text className="mt-1 text-[11px] text-slate-500">
                {kendaraan ? kendaraan.plat_nomor : 'Hubungi admin untuk mendaftarkan kendaraan'}
              </Text>
            </View>
            {kendaraan && (
              <View className="rounded-full bg-emerald-100 px-2 py-1">
                <Text className="text-[10px] text-emerald-800">Terdaftar</Text>
              </View>
            )}
          </View>

          {kendaraan ? (
            <>
              <View className="rounded-xl border border-stone-200 bg-white/80 p-4">
                <Text className="mb-4 text-[14px] font-semibold text-[#202a27]">Data Kendaraan</Text>
                {fields.map((field) => (
                  <View key={field.label} className="mb-3">
                    <Text className="mb-1.5 text-[11px] text-slate-500">{field.label}</Text>
                    <TextInput
                      accessibilityLabel={field.label}
                      value={field.value}
                      onChangeText={field.onChangeText}
                      className="rounded-lg border border-stone-200 bg-white px-3 py-3 text-[13px] text-[#202a27]"
                    />
                  </View>
                ))}
              </View>

              <Text className="my-3 text-[11px] leading-4 text-slate-500">
                Pastikan data sesuai dengan kendaraan yang digunakan untuk mengantar pesanan.
              </Text>

              {error ? (
                <Text accessibilityRole="alert" className="mb-3 text-[12px] text-red-700">{error}</Text>
              ) : null}

              <TouchableOpacity
                accessibilityRole="button"
                onPress={handleSimpan}
                disabled={saving}
                className="mb-2 items-center rounded-lg bg-emerald-800 py-3"
              >
                {saving
                  ? <ActivityIndicator color="#fff" />
                  : <Text className="text-[13px] font-semibold text-white">Simpan</Text>
                }
              </TouchableOpacity>

              <TouchableOpacity
                accessibilityRole="button"
                onPress={() => router.back()}
                className="items-center rounded-lg border border-emerald-800 py-3"
              >
                <Text className="text-[13px] font-medium text-emerald-800">Batal</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View className="items-center rounded-xl border border-stone-200 bg-white/60 px-4 py-8">
              <Text className="text-center text-[12px] text-slate-500">
                Belum ada kendaraan terdaftar. Hubungi admin untuk mendaftarkan kendaraan kamu.
              </Text>
            </View>
          )}
        </ScrollView>
      )}
      <CourierBottomTabs activeTab="profile" />
    </ScreenWrapper>
  );
}

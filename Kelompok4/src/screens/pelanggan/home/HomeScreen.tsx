import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomerTabBar from '@/components/CustomerTabBar';
import { useCart } from '@/context/cart-context';

export default function HomeScreen() {
  const router = useRouter();
  const { products, addItem } = useCart();
  const recommended = products.slice(0, 2);

  return (
    <SafeAreaView className="flex-1 bg-orange-50">
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="px-6 pt-3"
        contentContainerStyle={{ paddingBottom: 20 }}>
        <View className="mb-5 flex-row items-center justify-between">
          <TouchableOpacity
            className="flex-row items-center gap-2"
            onPress={() => router.push('/menu')}>
            <Feather name="map-pin" size={20} color="#166534" />
            <Text className="text-lg font-semibold text-black">Kota Cirebon</Text>
            <Feather name="chevron-down" size={20} color="#166534" />
          </TouchableOpacity>
          <TouchableOpacity accessibilityLabel="Buka pesanan" onPress={() => router.push('/orders')}>
            <Feather name="bell" size={20} color="#18181b" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          className="mb-6 h-12 flex-row items-center rounded-lg border border-neutral-200 bg-white/70 px-4"
          onPress={() => router.push('/menu')}>
          <Feather name="search" size={20} color="#6b7280" />
          <TextInput
            editable={false}
            className="ml-2.5 flex-1 text-base text-zinc-900"
            placeholder="Cari menu, kategori, atau makanan..."
            placeholderTextColor="#6b7280"
          />
        </TouchableOpacity>

        <TouchableOpacity
          className="relative mb-6 h-44 justify-center overflow-hidden rounded-2xl bg-green-950 p-5"
          onPress={() => router.push('/menu')}>
          <Image
            source={require('../../../../assets/images/logo/home.png')}
            className="absolute right-0 top-0 h-full w-40 opacity-50"
            resizeMode="cover"
          />
          <Text className="mb-1 text-2xl font-bold text-white">Nasi Bakar Ibu Efri</Text>
          <Text className="mb-3 text-lg font-semibold leading-6 text-white">
            Rasa Tradisional{'\n'}Harga Bersahabat
          </Text>
          <View className="mt-2 flex-row gap-1.5">
            <View className="h-1.5 w-1.5 rounded-full bg-lime-50" />
            <View className="h-1.5 w-1.5 rounded-full bg-neutral-500" />
            <View className="h-1.5 w-1.5 rounded-full bg-neutral-500" />
          </View>
        </TouchableOpacity>

        <View className="mb-8 flex-row justify-between">
          {[
            { label: 'Semua', icon: 'grid' as const },
            { label: 'Nasi Bakar', icon: 'box' as const },
            { label: 'Minuman', icon: 'coffee' as const },
            { label: 'Tambahan', icon: 'plus-circle' as const },
          ].map((category) => (
            <TouchableOpacity
              key={category.label}
              className="items-center gap-2"
              onPress={() => router.push('/menu')}>
              <View className="h-16 w-16 items-center justify-center rounded-full bg-amber-100">
                <Feather name={category.icon} size={24} color="#166534" />
              </View>
              <Text className="text-xs font-medium text-black">{category.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className="mb-4 flex-row items-center justify-between">
          <Text className="text-base font-semibold text-black">Rekomendasi untuk Kamu</Text>
          <TouchableOpacity onPress={() => router.push('/menu')}>
            <Text className="text-sm font-medium text-green-800">Lihat Semua</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row gap-4 pb-4">
          {recommended.map((product) => (
            <TouchableOpacity
              key={product.id}
              accessibilityRole="button"
              className="flex-1 flex-col gap-3"
              onPress={() => addItem(product)}>
              <Image
                source={product.image}
                className="h-36 w-full rounded-xl"
                resizeMode="cover"
              />
              <View>
                <Text className="mb-1 text-base text-zinc-900">{product.name}</Text>
                <Text className="text-base font-semibold text-zinc-900">
                  Rp {product.price.toLocaleString('id-ID')} · Tambah
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <CustomerTabBar />
    </SafeAreaView>
  );
}

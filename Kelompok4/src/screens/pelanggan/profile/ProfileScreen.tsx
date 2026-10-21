import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const router = useRouter();

  const menuList = [
    { title: 'Data Diri', icon: 'person-outline' },
    { title: 'Alamat Saya', icon: 'location-outline' },
    { title: 'Riwayat Pesanan', icon: 'receipt-outline' },
    { title: 'Pengaturan', icon: 'settings-outline' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profil Saya</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileBox}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={40} color="#cbd5e1" />
          </View>
          <Text style={styles.userName}>Ibrahim Hilal</Text>
          <Text style={styles.userEmail}>ibrahimhilal@email.com</Text>
          <Text style={styles.userPhone}>0812 3456 7890</Text>
        </View>

        {menuList.map((item, idx) => (
          <TouchableOpacity key={idx} style={styles.menuCard}>
            <Ionicons name={item.icon as any} size={20} color="#64748b" />
            <Text style={styles.menuText}>{item.title}</Text>
            <Ionicons name="chevron-forward" size={18} color="#cbd5e1" />
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={[styles.menuCard, { marginTop: 16 }]}
          onPress={() => router.push('/')}>
          <Ionicons name="log-out-outline" size={20} color="#ef4444" />
          <Text style={[styles.menuText, { color: '#ef4444' }]}>Logout</Text>
          <Ionicons name="chevron-forward" size={18} color="#cbd5e1" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#0f172a' },
  content: { padding: 20 },
  profileBox: { alignItems: 'center', marginVertical: 20 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  userName: { fontSize: 18, fontWeight: '700', color: '#0f172a' },
  userEmail: { fontSize: 13, color: '#64748b', marginTop: 2 },
  userPhone: { fontSize: 13, color: '#64748b', marginTop: 2 },
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  menuText: { flex: 1, marginLeft: 12, fontSize: 14, color: '#1e293b' },
});
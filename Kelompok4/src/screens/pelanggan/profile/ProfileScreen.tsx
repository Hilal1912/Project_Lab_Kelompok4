import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const menuList: {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { title: 'Data Diri', icon: 'person-outline' },
  { title: 'Alamat Saya', icon: 'location-outline' },
  { title: 'Riwayat Pesanan', icon: 'receipt-outline' },
  { title: 'Pengaturan', icon: 'settings-outline' },
];

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityLabel="Kembali"
        >
          <Ionicons name="arrow-back" size={20} color="#19231F" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profil</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileBox}>
          <View style={styles.avatar}>
            <Ionicons name="person-outline" size={36} color="#C8CECA" />
          </View>
          <Text style={styles.userName}>Ibrahim Hilal</Text>
          <Text style={styles.userEmail}>ibrahimhilal@email.com</Text>
          <Text style={styles.userPhone}>0812 3456 7890</Text>
        </View>

        <View style={styles.menuCard}>
          {menuList.map((item, index) => (
            <TouchableOpacity
              key={item.title}
              style={[
                styles.menuRow,
                index < menuList.length - 1 && styles.menuRowBorder,
              ]}
              activeOpacity={0.7}
            >
              <Ionicons name={item.icon} size={17} color="#68736E" />
              <Text style={styles.menuText}>{item.title}</Text>
              <Ionicons name="chevron-forward" size={16} color="#A9B0AC" />
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={[styles.menuRow, styles.logoutRow]}
            activeOpacity={0.7}
            onPress={() => router.replace('/')}
          >
            <Ionicons name="log-out-outline" size={17} color="#D65A55" />
            <Text style={styles.logoutText}>Logout</Text>
            <Ionicons name="chevron-forward" size={16} color="#A9B0AC" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F1',
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    color: '#19231F',
    fontSize: 17,
    fontWeight: '600',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  profileBox: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 22,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 1,
    borderColor: '#DDE1DD',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  userName: {
    color: '#19231F',
    fontSize: 14,
    fontWeight: '600',
  },
  userEmail: {
    color: '#68736E',
    fontSize: 10,
    marginTop: 5,
  },
  userPhone: {
    color: '#68736E',
    fontSize: 10,
    marginTop: 4,
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E1E4E1',
    borderRadius: 9,
    paddingHorizontal: 11,
  },
  menuRow: {
    minHeight: 39,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  menuRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#EEF0EC',
  },
  menuText: {
    flex: 1,
    color: '#19231F',
    fontSize: 11,
  },
  logoutRow: {
    borderTopWidth: 1,
    borderTopColor: '#EEF0EC',
  },
  logoutText: {
    flex: 1,
    color: '#D65A55',
    fontSize: 11,
  },
});

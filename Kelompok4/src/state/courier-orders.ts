import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useSyncExternalStore } from 'react';

export type CourierOrderStatus = 'antrian' | 'proses' | 'perjalanan' | 'selesai';

export interface CourierOrderItem {
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface CourierOrder {
  id: string;
  time: string;
  dateTime: string;
  customer: string;
  address: string;
  status: CourierOrderStatus;
  items: CourierOrderItem[];
  deliveryFee: number;
  paymentStatus: string;
}

export interface CourierProfile {
  isAvailable: boolean;
  name: string;
  courierId: string;
  phone: string;
  email: string;
  region: string;
  vehicleType: string;
  vehicleName: string;
  plate: string;
}

interface CourierDataSnapshot {
  orders: CourierOrder[];
  history: CourierOrder[];
  profile: CourierProfile;
}

interface CourierHookSnapshot extends CourierDataSnapshot {
  isHydrated: boolean;
  persistenceError: string | null;
}

const storageKey = 'courier-data-v1';

const initialOrders: CourierOrder[] = [
  {
    id: 'NB20250601',
    time: '10:25',
    dateTime: '1 Jun 2025 · 10:25',
    customer: 'Nurkhotimah',
    address: 'Jl. Cangkring No. 5, Cirebon',
    status: 'antrian',
    items: [
      { name: 'Nasi Bakar Ayam', quantity: 2, unitPrice: 20000 },
      { name: 'Es Teh Manis', quantity: 2, unitPrice: 5000 },
    ],
    deliveryFee: 10000,
    paymentStatus: 'Lunas',
  },
  {
    id: 'NB20250531',
    time: '12:10',
    dateTime: '31 Mei 2025 · 12:10',
    customer: 'Siti Aminah',
    address: 'Jl. Melati No. 12, Cirebon',
    status: 'proses',
    items: [
      { name: 'Nasi Bakar Cumi', quantity: 1, unitPrice: 22000 },
      { name: 'Es Teh Manis', quantity: 1, unitPrice: 10000 },
    ],
    deliveryFee: 10000,
    paymentStatus: 'Lunas',
  },
];

const initialHistory: CourierOrder[] = [
  {
    id: 'NB20250530',
    time: '14:20',
    dateTime: '30 Mei 2025 · 14:20',
    customer: 'Siti Aminah',
    address: 'Jl. Cangkring No. 5, Cirebon',
    status: 'selesai',
    items: [
      { name: 'Nasi Bakar Ayam', quantity: 2, unitPrice: 20000 },
      { name: 'Es Teh Manis', quantity: 2, unitPrice: 10000 },
    ],
    deliveryFee: 10000,
    paymentStatus: 'Lunas',
  },
  {
    id: 'NB20250528',
    time: '11:10',
    dateTime: '28 Mei 2025 · 11:10',
    customer: 'Siti Aminah',
    address: 'Jl. Cipto No. 24, Cirebon',
    status: 'selesai',
    items: [
      { name: 'Nasi Bakar Cumi', quantity: 1, unitPrice: 22000 },
      { name: 'Es Teh Manis', quantity: 1, unitPrice: 10000 },
    ],
    deliveryFee: 10000,
    paymentStatus: 'Lunas',
  },
  {
    id: 'NB20250525',
    time: '16:45',
    dateTime: '25 Mei 2025 · 16:45',
    customer: 'Nurkhotimah',
    address: 'Jl. Pemuda No. 5, Cirebon',
    status: 'selesai',
    items: [{ name: 'Nasi Bakar Ayam', quantity: 2, unitPrice: 20000 }],
    deliveryFee: 10000,
    paymentStatus: 'Lunas',
  },
];

const initialProfile: CourierProfile = {
  isAvailable: true,
  name: 'Ahmad Fauzi',
  courierId: 'K001',
  phone: '0812 3456 7890',
  email: 'ahmad.fauzi@email.com',
  region: 'Cirebon',
  vehicleType: 'Sepeda motor',
  vehicleName: 'Honda Vario',
  plate: 'E 3456 AB',
};

let snapshot: CourierDataSnapshot = {
  orders: initialOrders,
  history: initialHistory,
  profile: initialProfile,
};

const listeners = new Set<() => void>();
let isHydrated = false;
let persistenceError: string | null = null;
let hydrationPromise: Promise<void> | undefined;
let writeQueue = Promise.resolve();
let hookSnapshot: CourierHookSnapshot = { ...snapshot, isHydrated, persistenceError };

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return hookSnapshot;
}

function notifyListeners() {
  hookSnapshot = { ...snapshot, isHydrated, persistenceError };
  listeners.forEach((listener) => listener());
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isCourierOrder(value: unknown): value is CourierOrder {
  if (!isRecord(value)) return false;

  return (
    typeof value.id === 'string' &&
    typeof value.time === 'string' &&
    typeof value.dateTime === 'string' &&
    typeof value.customer === 'string' &&
    typeof value.address === 'string' &&
    (value.status === 'antrian' ||
      value.status === 'proses' ||
      value.status === 'perjalanan' ||
      value.status === 'selesai')
  );
}

function normalizeOrder(value: CourierOrder, defaults: CourierOrder[]): CourierOrder {
  const fallback = defaults.find((item) => item.id === value.id);
  const stored = value as CourierOrder & {
    items?: unknown;
    deliveryFee?: unknown;
    paymentStatus?: unknown;
  };
  const validItems =
    Array.isArray(stored.items) &&
    stored.items.every(
      (item) =>
        isRecord(item) &&
        typeof item.name === 'string' &&
        typeof item.quantity === 'number' &&
        typeof item.unitPrice === 'number',
    );

  return {
    ...fallback,
    ...value,
    items: validItems ? (stored.items as CourierOrderItem[]) : fallback?.items ?? [],
    deliveryFee:
      typeof stored.deliveryFee === 'number'
        ? stored.deliveryFee
        : fallback?.deliveryFee ?? 0,
    paymentStatus:
      typeof stored.paymentStatus === 'string'
        ? stored.paymentStatus
        : fallback?.paymentStatus ?? 'Lunas',
  };
}

function restoreSnapshot(serialized: string): CourierDataSnapshot {
  const value: unknown = JSON.parse(serialized);
  if (
    !isRecord(value) ||
    value.version !== 1 ||
    !Array.isArray(value.orders) ||
    !value.orders.every(isCourierOrder) ||
    !Array.isArray(value.history) ||
    !value.history.every(isCourierOrder) ||
    !isRecord(value.profile) ||
    typeof value.profile.isAvailable !== 'boolean' ||
    typeof value.profile.phone !== 'string' ||
    typeof value.profile.email !== 'string'
  ) {
    throw new Error('Stored courier data has an invalid format.');
  }

  return {
    orders: value.orders.map((order) => normalizeOrder(order, initialOrders)),
    history: value.history.map((order) => normalizeOrder(order, initialHistory)),
    profile: {
      ...initialProfile,
      ...value.profile,
      isAvailable: value.profile.isAvailable,
      phone: value.profile.phone,
      email: value.profile.email,
    },
  };
}

function persistSnapshot() {
  const serialized = JSON.stringify({ version: 1, ...snapshot });
  writeQueue = writeQueue.then(async () => {
    try {
      await AsyncStorage.setItem(storageKey, serialized);
      if (persistenceError) {
        persistenceError = null;
        notifyListeners();
      }
    } catch (error) {
      console.error('Unable to save courier data.', error);
      persistenceError = 'Perubahan belum berhasil disimpan di perangkat.';
      notifyListeners();
    }
  });
}

function commitSnapshot(nextSnapshot: CourierDataSnapshot) {
  snapshot = nextSnapshot;
  notifyListeners();
  persistSnapshot();
}

function hydrateSnapshot() {
  if (!hydrationPromise) {
    hydrationPromise = AsyncStorage.getItem(storageKey)
      .then((serialized) => {
        if (serialized !== null) snapshot = restoreSnapshot(serialized);
      })
      .catch((error: unknown) => {
        console.error('Unable to load courier data.', error);
        persistenceError = 'Data tersimpan tidak dapat dimuat; data contoh ditampilkan.';
      })
      .finally(() => {
        isHydrated = true;
        notifyListeners();
      });
  }
  return hydrationPromise;
}

export function useCourierData() {
  const data = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  useEffect(() => {
    void hydrateSnapshot();
  }, []);
  return data;
}

export function updateCourierOrderStatus(id: string) {
  if (!isHydrated) return;

  const order = snapshot.orders.find((item) => item.id === id);
  if (!order) return;

  const nextStatus: CourierOrderStatus =
    order.status === 'antrian'
      ? 'proses'
      : order.status === 'proses'
        ? 'perjalanan'
        : 'selesai';

  if (nextStatus === 'selesai') {
    commitSnapshot({
      orders: snapshot.orders.filter((item) => item.id !== id),
      history: [{ ...order, status: 'selesai' }, ...snapshot.history],
      profile: snapshot.profile,
    });
  } else {
    commitSnapshot({
      ...snapshot,
      orders: snapshot.orders.map((item) =>
        item.id === id ? { ...item, status: nextStatus } : item,
      ),
    });
  }
}

export function updateCourierProfile(profile: Partial<CourierProfile>) {
  if (!isHydrated) return;

  commitSnapshot({
    ...snapshot,
    profile: { ...snapshot.profile, ...profile },
  });
}

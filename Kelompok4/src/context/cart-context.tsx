import React, { createContext, useContext, useMemo, useState, type PropsWithChildren } from 'react';
import type { ImageSourcePropType } from 'react-native';

export type Product = {
  id: string;
  name: string;
  price: number;
  category: 'Nasi Bakar' | 'Minuman' | 'Tambahan';
  image: ImageSourcePropType;
};

export type CartItem = Product & { quantity: number };
export type OrderType = 'Dine-in' | 'Take Away' | 'Delivery';

export type PlacedOrder = {
  id: string;
  items: CartItem[];
  orderType: OrderType;
  paymentMethod: string;
  note: string;
  total: number;
  createdAt: string;
};

const products: Product[] = [
  { id: 'nasi-ayam', name: 'Nasi Bakar Ayam', price: 15000, category: 'Nasi Bakar', image: require('../../assets/images/logo/ayam.png') },
  { id: 'nasi-cumi', name: 'Nasi Bakar Cumi', price: 17000, category: 'Nasi Bakar', image: require('../../assets/images/logo/cumi.png') },
  { id: 'nasi-teri', name: 'Nasi Bakar Teri', price: 13000, category: 'Nasi Bakar', image: require('../../assets/images/logo/teri.png') },
  { id: 'es-teh', name: 'Es Teh Manis', price: 5000, category: 'Minuman', image: require('../../assets/images/logo/es teh manis.png') },
  { id: 'es-jeruk', name: 'Es Jeruk', price: 6000, category: 'Minuman', image: require('../../assets/images/logo/es jeruk.png') },
  { id: 'kerupuk', name: 'Kerupuk', price: 3000, category: 'Tambahan', image: { uri: 'https://placehold.co/400x400.png' } },
];

type CartContextValue = {
  products: Product[];
  items: CartItem[];
  orders: PlacedOrder[];
  orderType: OrderType | null;
  note: string;
  setNote: (note: string) => void;
  setOrderType: (type: OrderType) => void;
  addItem: (product: Product) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  placeOrder: (paymentMethod: string) => PlacedOrder | null;
  itemCount: number;
  subtotal: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: PropsWithChildren) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<PlacedOrder[]>([]);
  const [orderType, setOrderType] = useState<OrderType | null>(null);
  const [note, setNote] = useState('');

  const value = useMemo<CartContextValue>(() => {
    const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
    const itemCount = items.reduce((total, item) => total + item.quantity, 0);

    return {
      products,
      items,
      orders,
      orderType,
      note,
      setNote,
      setOrderType,
      addItem: (product) => {
        setItems((current) => {
          const existing = current.find((item) => item.id === product.id);
          return existing
            ? current.map((item) =>
                item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
              )
            : [...current, { ...product, quantity: 1 }];
        });
      },
      updateQuantity: (id, quantity) => {
        setItems((current) =>
          quantity <= 0
            ? current.filter((item) => item.id !== id)
            : current.map((item) => (item.id === id ? { ...item, quantity } : item)),
        );
      },
      removeItem: (id) => setItems((current) => current.filter((item) => item.id !== id)),
      placeOrder: (paymentMethod) => {
        if (items.length === 0 || orderType === null) return null;
        const deliveryFee = orderType === 'Delivery' ? 20000 : 0;
        const order: PlacedOrder = {
          id: `ORD-${Date.now()}`,
          items: [...items],
          orderType,
          paymentMethod,
          note,
          total: subtotal + deliveryFee,
          createdAt: new Date().toISOString(),
        };
        setOrders((current) => [order, ...current]);
        setItems([]);
        setOrderType(null);
        setNote('');
        return order;
      },
      itemCount,
      subtotal,
    };
  }, [items, note, orderType, orders]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}

import { Redirect } from 'expo-router';
import CartScreen from '../screens/pelanggan/order/CartScreen';

export default function Page() {
  const isAdmin = false;

  if (isAdmin) {
    return <Redirect href={'/(admin)' as any} />;
  }

  return <CartScreen />;
}
import { useCartStore } from 'store/cartStore';

export function useCartTotal(): number {
  const items = useCartStore((state) => state.items);
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

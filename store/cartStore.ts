import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// カート内の各アイテムの型定義
export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
};

// カートの状態とアクションの型定義
type CartState = {
  items: CartItem[]; // カート内の商品リスト
  addToCart: (item: CartItem) => void; // 商品を追加するアクション
  removeFromCart: (id: string) => void; // 商品を削除するアクション
  updateQuantity: (id: string, quantity: number) => void; // 数量を更新するアクション
  clearCart: () => void; // カートを空にするアクション
  totalPrice: () => number; // 合計金額を計算する関数
  setItems: (items: CartItem[]) => void; // 外部からカート内容を上書き（Firestore用）
};

// Zustand ストアの作成と persist ミドルウェアの適用
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (item) =>
        set((state) => {
          const exist = state.items.find((i) => i.id === item.id);
          if (exist) {
            return {
              items: state.items.map((i) =>
                i.id === item.id
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, item] };
        }),

      removeFromCart: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
      },

      updateQuantity: (id, quantity) => {
        if (quantity < 1) return;

        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      totalPrice: () => {
        return get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      },

      // Firestore から受け取った items を Zustand に上書きするための関数
      setItems: (items) => set({ items }),
    }),
    {
      name: 'ecommerce-cart-storage', // localStorageに保存されるキー名
      storage: createJSONStorage(() => localStorage),
    }
  )
);

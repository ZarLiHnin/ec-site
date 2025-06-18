'use client';

import { useState } from 'react';
import { useCartStore, CartItem } from 'store/cartStore';

type Props = {
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
  };
};

export default function AddToCartButton({ product }: Props) {
  const addToCart = useCartStore((state) => state.addToCart);
  const [added, setAdded] = useState(false);

  const handleClick = () => {
    const item: CartItem = {
      ...product,
      quantity: 1,
    };
    addToCart(item);
    setAdded(true);

    // メッセージは2秒後に非表示にする
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="space-y-2">
      <button
        onClick={handleClick}
        className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition"
      >
        カートに入れる
      </button>
      {added && (
        <p className="text-sm text-green-600">カートに追加しました！</p>
      )}
    </div>
  );
}

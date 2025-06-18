'use client';

import { useCartStore } from 'store/cartStore';

export default function CartContents() {
  const items = useCartStore((state) => state.items);

  return (
    <div>
      <h2>カートの中身</h2>
      {items.length === 0 ? (
        <p>カートは空です</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              {item.name} × {item.quantity}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

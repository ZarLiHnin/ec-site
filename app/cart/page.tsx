'use client';

import NavBar from 'components/NavBar';
import { useCartStore } from 'store/cartStore';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from 'lib/firebase';

export default function CartPage() {
  const [user, setUser] = useState<User | null | undefined>(undefined); // undefined 初期値でローディング判定可

  const items = useCartStore((state) => state.items);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const totalPrice = useCartStore((state) => state.totalPrice());

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsub();
  }, []);

  return (
    <>
      <NavBar />
      <div className="max-w-3xl mx-auto p-6 mt-6">
        {user === undefined ? (
          <p>読み込み中...</p>
        ) : user === null ? (
          <div className="bg-pink-50 border border-pink-300 rounded-lg p-6 shadow-md text-center">
            <h2 className="text-xl font-bold text-pink-700 mb-4">
              ログインが必要です
            </h2>
            <p className="text-gray-700 mb-4">
              カートを確認するにはログインしてください。
            </p>
            <Link href="/auth">
              <button className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded transition">
                ログインページへ
              </button>
            </Link>
          </div>
        ) : (
          <div className="bg-pink-50 rounded-lg shadow-lg border border-pink-300 p-6">
            <h1 className="text-3xl font-extrabold mb-8 text-black border-b-4 border-pink-400 pb-3">
              カート
            </h1>
            {items.length === 0 ? (
              <p className="text-center text-pink-700 italic">
                カートに商品がありません。
              </p>
            ) : (
              <>
                <ul>
                  {items.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center border-b border-pink-200 py-4 last:border-b-0"
                    >
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="object-cover rounded-md border border-pink-200 shadow-sm"
                      />
                      <div className="ml-4 flex-1">
                        <h2 className="font-semibold text-black">
                          <Link
                            href={`/products/${item.id}`}
                            className="hover:underline text-pink-800"
                          >
                            {item.name}
                          </Link>
                        </h2>
                        <p className="text-pink-700 font-semibold">
                          ¥{item.price.toLocaleString()}
                        </p>
                      </div>
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(item.id, Number(e.target.value))
                        }
                        className="w-16 border border-pink-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-pink-400"
                      />
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="ml-6 text-red-600 hover:text-red-800 hover:underline transition"
                      >
                        削除
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="text-right mt-8 text-2xl font-extrabold text-pink-800">
                  合計:{' '}
                  <span className="text-black">
                    ¥{totalPrice.toLocaleString()}
                  </span>
                </div>

                <div className="text-right mt-6">
                  <Link href="/checkout">
                    <button className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-6 rounded shadow-md transition">
                      購入手続きへ進む
                    </button>
                  </Link>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}

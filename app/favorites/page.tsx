// app/favorites/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from 'lib/firebase';
import { getUserFavorites, removeFavorite } from 'lib/firestore/favorites';
import { getProductById, Product } from 'lib/fetchProducts';
import Link from 'next/link';
import NavBar from 'components/NavBar';
import Image from 'next/image';

export default function FavoritesPage() {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const ids = await getUserFavorites(user.uid);
      const prods = await Promise.all(ids.map((id) => getProductById(id)));
      setProducts(prods.filter((p): p is Product => !!p));
    })();
  }, [user]);

  const handleRemove = async (productId: string) => {
    if (!user) return;
    await removeFavorite(user.uid, productId);
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  if (!user) {
    return (
      <>
        <NavBar />
        <main className="max-w-2xl mx-auto p-6">
          <div className="border border-pink-300 bg-pink-50 rounded-xl p-6 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-pink-800 mb-2">
              ログインが必要です
            </h2>
            <p className="text-pink-700 mb-4">
              このページを見るにはログインしてください。
            </p>
            <Link
              href="/auth"
              className="inline-block bg-pink-500 hover:bg-pink-600 text-white font-medium px-4 py-2 rounded transition"
            >
              ログインページへ
            </Link>
          </div>
        </main>
      </>
    );
  } else {
    return (
      <>
        <NavBar />
        <main className="max-w-4xl mx-auto p-6">
          <h1 className="text-2xl font-bold mb-4">お気に入り一覧</h1>
          {products.length === 0 ? (
            <p>お気に入りがありません。</p>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {products.map((p) => (
                <li
                  key={p.id}
                  className="border rounded-2xl overflow-hidden shadow hover:shadow-lg transition"
                >
                  <Link href={`/products/${p.id}`} className="block">
                    <Image
                      src={p.imageUrl}
                      alt={p.name}
                      width={400}
                      height={300}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h2 className="text-lg font-semibold mb-1">{p.name}</h2>
                      <p className="text-gray-700 font-medium">
                        ￥{p.price.toLocaleString()}
                      </p>
                    </div>
                  </Link>
                  <div className="p-4 border-t flex justify-end">
                    <button
                      onClick={() => handleRemove(p.id)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      お気に入りから削除
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </main>
      </>
    );
  }
}

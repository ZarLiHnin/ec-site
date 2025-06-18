'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from 'lib/firebase';
import { getPurchaseHistory } from 'lib/firestore/purchases';
import { getProductById } from 'lib/fetchProducts';
import NavBar from 'components/NavBar';
import Image from 'next/image';
import Link from 'next/link';

export default function HistoryPage() {
  const [user, setUser] = useState<User | null>(null);
  const [records, setRecords] = useState<
    Array<{
      id: string;
      name: string;
      at: Date;
      price: number;
      imageUrl: string;
    }>
  >([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const hist = await getPurchaseHistory(user.uid);
      const detailed = await Promise.all(
        hist.map(async ({ productId, purchasedAt }) => {
          const prod = await getProductById(productId);
          return prod
            ? {
                id: productId,
                name: prod.name,
                at: purchasedAt.toDate(),
                price: prod.price,
                imageUrl: prod.imageUrl,
              }
            : null;
        })
      );
      setRecords(
        detailed.filter(
          (
            r
          ): r is {
            id: string;
            name: string;
            at: Date;
            price: number;
            imageUrl: string;
          } => !!r
        )
      );
    })();
  }, [user]);

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
          <h1 className="text-2xl font-bold mb-4">購入履歴</h1>
          {records.length === 0 ? (
            <p>購入履歴がありません。</p>
          ) : (
            <ul className="space-y-6">
              {records.map((r, i) => (
                <li
                  key={i}
                  className="flex items-center gap-4 border rounded-xl p-4 shadow-sm"
                >
                  <Image
                    src={r.imageUrl}
                    alt={r.name}
                    width={100}
                    height={100}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div>
                    <Link href={`/products/${r.id}`} className="block">
                      <h2 className="text-lg font-semibold">{r.name}</h2>
                    </Link>

                    <p className="text-gray-700">
                      ￥{r.price.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      購入日：{r.at.toLocaleDateString()}
                    </p>
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

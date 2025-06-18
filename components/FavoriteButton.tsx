'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from 'lib/firebase';
import { addFavorite, getUserFavorites } from 'lib/firestore/favorites';

export default function FavoriteButton({ productId }: { productId: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [added, setAdded] = useState(false);

  // ログイン状態を監視
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  // 既にお気に入りかチェック
  useEffect(() => {
    if (!user) return;
    getUserFavorites(user.uid).then((ids) => {
      if (ids.includes(productId)) setAdded(true);
    });
  }, [user, productId]);

  const handleClick = async () => {
    if (!user) {
      alert('ログインしてください');
      return;
    }
    try {
      await addFavorite(user.uid, productId);
      setAdded(true);
      alert('お気に入りに追加しました');
    } catch {
      alert('お気に入りに追加できませんでした');
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={added}
      className={`mt-4 px-4 py-2 rounded ${
        added
          ? 'bg-gray-400 text-white cursor-not-allowed'
          : 'bg-pink-500 text-white hover:bg-pink-600'
      } focus:outline-none focus-visible:ring-2 focus-visible:ring-white`}
      aria-pressed={added}
    >
      {added ? '❤️ 登録済み' : '♡ お気に入りに追加'}
    </button>
  );
}

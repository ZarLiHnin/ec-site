'use client';

import Link from 'next/link';

export default function NavBar() {
  return (
    <nav className="bg-pink-500 text-white px-6 py-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link
          href="/"
          className="text-2xl fonttext-2xl font-bold no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:rounded-sm-bold no-underline focus:outline-none focus:ring-0"
        >
          🛍️ PinkyShop
        </Link>
        <div className="space-x-6">
          <Link
            target="no_blank"
            rel="noopener"
            href="/cart"
            className="hover:underline hover:text-pink-300 transition"
          >
            カート
          </Link>
          <Link
            href="/favorites"
            className="hover:underline hover:text-pink-300 transition"
          >
            お気に入り
          </Link>
          <Link
            href="/history"
            className="hover:underline hover:text-pink-300 transition"
          >
            購入履歴
          </Link>
          <Link
            href="/auth"
            className="hover:underline hover:text-pink-300 transition"
          >
            ログイン / 登録
          </Link>
        </div>
      </div>
    </nav>
  );
}

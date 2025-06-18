'use client';

import { useState, useEffect } from 'react';
import { FirebaseError } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { auth } from '../../lib/firebase';
import NavBar from 'components/NavBar';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setErrorMessage(null); // ユーザー状態変化でエラークリア
    });
    return () => unsubscribe();
  }, []);

  const handleRegister = async () => {
    setErrorMessage(null);
    if (!email || !password) {
      setErrorMessage('メールアドレスとパスワードを入力してください。');
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      setUser(userCredential.user);
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        switch (err.code) {
          case 'auth/email-already-in-use':
            setErrorMessage('このメールアドレスは既に登録されています。');
            break;
          case 'auth/invalid-email':
            setErrorMessage('無効なメールアドレスです。');
            break;
          case 'auth/weak-password':
            setErrorMessage(
              'パスワードが弱すぎます。6文字以上で設定してください。'
            );
            break;
          default:
            setErrorMessage('登録時にエラーが発生しました。');
        }
      } else {
        setErrorMessage('登録時にエラーが発生しました。');
      }
    }
  };

  const handleLogin = async () => {
    setErrorMessage(null);
    if (!email || !password) {
      setErrorMessage('メールアドレスとパスワードを入力してください。');
      return;
    }
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      setUser(userCredential.user);
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        switch (err.code) {
          case 'auth/user-not-found':
            setErrorMessage(
              'ユーザーが見つかりません。メールアドレスを確認してください。'
            );
            break;
          case 'auth/wrong-password':
            setErrorMessage(
              'パスワードが間違っています。もう一度入力してください。'
            );
            break;
          case 'auth/invalid-email':
            setErrorMessage('無効なメールアドレスです。');
            break;
          default:
            setErrorMessage('ログイン時にエラーが発生しました。');
        }
      } else {
        setErrorMessage('ログイン時にエラーが発生しました。');
      }
    }
  };

  const handleLogout = async () => {
    setErrorMessage(null);
    await signOut(auth);
    setUser(null);
    setEmail('');
    setPassword('');
  };

  return (
    <>
      <NavBar />
      <div className="max-w-md mx-auto mt-10 p-8 bg-pink-50 rounded-lg shadow-lg border border-pink-300">
        <h1 className="text-3xl font-bold mb-6 text-black text-center border-b-4 border-pink-400 pb-3">
          ユーザー認証
        </h1>

        <label
          htmlFor="email"
          className="block mb-1 text-sm font-medium text-gray-800"
        >
          メールアドレス
        </label>
        <input
          className="border border-pink-400 rounded px-4 py-3 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-pink-400"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          disabled={!!user}
        />
        <label
          htmlFor="password"
          className="block mb-1 text-sm font-medium text-gray-800 mt-4"
        >
          パスワード
        </label>
        <input
          className="border border-pink-400 rounded px-4 py-3 w-full mb-6 focus:outline-none focus:ring-2 focus:ring-pink-400"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          disabled={!!user}
        />

        {errorMessage && (
          <p className="text-red-600 mb-4 text-center font-semibold">
            {errorMessage}
          </p>
        )}

        <div className="flex justify-between space-x-4">
          <button
            aria-label="新規登録"
            className="flex-1 bg-pink-500 text-white rounded py-3 font-semibold hover:bg-pink-600 transition disabled:bg-pink-300 disabled:cursor-not-allowed"
            onClick={handleRegister}
            disabled={!!user}
          >
            登録
          </button>
          <button
            className="flex-1 bg-pink-700 text-white rounded py-3 font-semibold hover:bg-pink-800 transition disabled:bg-pink-400 disabled:cursor-not-allowed"
            onClick={handleLogin}
            disabled={!!user}
          >
            ログイン
          </button>
          <button
            className="flex-1 bg-gray-600 text-white rounded py-3 font-semibold hover:bg-gray-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            onClick={handleLogout}
            disabled={!user}
          >
            ログアウト
          </button>
        </div>

        {user && (
          <p className="mt-6 text-center text-pink-700 font-semibold">
            ログイン中: {user.email}
          </p>
        )}
      </div>
    </>
  );
}

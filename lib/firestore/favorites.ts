// lib/firestore/favorites.ts
import {
  doc,
  setDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
} from 'firebase/firestore';
import { db } from 'lib/firebase';

// お気に入りに追加
export async function addFavorite(userId: string, productId: string) {
  const userDoc = doc(db, 'users', userId);
  await setDoc(userDoc, { favorites: arrayUnion(productId) }, { merge: true });
}

// お気に入り一覧取得
export async function getUserFavorites(userId: string): Promise<string[]> {
  const snap = await getDoc(doc(db, 'users', userId));
  return snap.exists() ? (snap.data().favorites ?? []) : [];
}

export async function removeFavorite(userId: string, productId: string) {
  const userDoc = doc(db, 'users', userId);
  await setDoc(userDoc, { favorites: arrayRemove(productId) }, { merge: true });
}

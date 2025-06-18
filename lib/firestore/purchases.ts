import { doc, setDoc, arrayUnion, getDoc, Timestamp } from 'firebase/firestore';
import { db } from 'lib/firebase';

export type PurchaseRecord = {
  productId: string;
  name: string;
  imageUrl?: string;
  purchasedAt: Timestamp; // ← Firestore Timestamp 型
};

export async function addPurchase(userId: string, productId: string) {
  const userDoc = doc(db, 'users', userId);
  await setDoc(
    userDoc,
    { purchases: arrayUnion({ productId, purchasedAt: Timestamp.now() }) },
    { merge: true }
  );
}

// カートの複数アイテムを一括追加
// 複数商品を一括追加する関数
export async function addPurchases(userId: string, productIds: string[]) {
  const userDoc = doc(db, 'users', userId);
  const records = productIds.map((productId) => ({
    productId,
    purchasedAt: Timestamp.now(),
  }));
  await setDoc(userDoc, { purchases: arrayUnion(...records) }, { merge: true });
}

export async function getPurchaseHistory(
  userId: string
): Promise<PurchaseRecord[]> {
  const snap = await getDoc(doc(db, 'users', userId));
  if (!snap.exists()) return [];
  const data = snap.data();
  const purchases = data.purchases as PurchaseRecord[] | undefined;
  return purchases ?? [];
}

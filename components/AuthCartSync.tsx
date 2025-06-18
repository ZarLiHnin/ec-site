'use client';

import { useEffect, useRef } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from 'lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { useCartStore } from 'store/cartStore';

export default function AuthCartSync() {
  const setItems = useCartStore((state) => state.setItems);
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  const skipNextSnapshot = useRef(false);
  const hasLoaded = useRef(false);
  const currentUserId = useRef<string | null>(null);

  // 🔁 Firestoreから読み込み
  useEffect(() => {
    let unsubscribeFromFirestore: (() => void) | null = null;

    const unsubscribeFromAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        currentUserId.current = user.uid;
        const cartDocRef = doc(db, 'carts', user.uid);

        unsubscribeFromFirestore = onSnapshot(cartDocRef, (docSnap) => {
          if (skipNextSnapshot.current) {
            skipNextSnapshot.current = false;
            return;
          }

          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data?.items) {
              setItems(data.items);
            } else {
              setItems([]);
            }
          } else {
            setItems([]);
          }

          hasLoaded.current = true;
        });
      } else {
        currentUserId.current = null;
        clearCart();
        hasLoaded.current = false;

        if (unsubscribeFromFirestore) {
          unsubscribeFromFirestore();
          unsubscribeFromFirestore = null;
        }
      }
    });

    return () => {
      unsubscribeFromAuth();
      if (unsubscribeFromFirestore) unsubscribeFromFirestore();
    };
  }, [setItems, clearCart]);

  // 📝 itemsに変化があったら書き込む
  useEffect(() => {
    if (!hasLoaded.current || !currentUserId.current) return;

    const cartDocRef = doc(db, 'carts', currentUserId.current);
    skipNextSnapshot.current = true;
    setDoc(cartDocRef, { items }, { merge: true });
  }, [items]);

  return null;
}

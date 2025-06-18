// lib/fetchProducts.ts
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

export type Product = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
};

export const fetchProducts = async (): Promise<Product[]> => {
  const querySnapshot = await getDocs(collection(db, 'products'));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Product[];
};

export const getAllProducts = fetchProducts;

export const getProductById = async (id: string): Promise<Product | null> => {
  const docRef = doc(db, 'products', id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() } as Product;
};

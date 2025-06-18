// components/ProductsList.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Product } from 'lib/fetchProducts';

export function ProductsList({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <Link
          href={`/products/${product.id}`}
          target="_blank"
          rel="noopener"
          key={product.id}
          className="
    bg-white rounded-lg shadow-md overflow-hidden 
    hover:shadow-xl hover:bg-pink-300 transition 
    duration-300 transform hover:-translate-y-1"
        >
          <div className="relative w-full h-60">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              priority
            />
          </div>
          <div className="p-4 flex flex-col justify-between h-36">
            <h2 className="text-xl font-semibold mb-2 text-gray-900 truncate">
              {product.name}
            </h2>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {product.description}
            </p>
            <p className="text-blue-700 font-extrabold text-right text-xl mt-auto">
              ¥{product.price.toLocaleString()}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}

import AddToCartButton from 'components/AddToCartButton';
import { getProductById, getAllProducts, Product } from 'lib/fetchProducts';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import NavBar from 'components/NavBar';
import FavoriteButton from 'components/FavoriteButton';

// type Props = {
//   params: { id: string };
// };
type Props = {
  params: Promise<{ id: string }>;
};

export const revalidate = 60; // ISR

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((product) => ({ id: product.id }));
}

export default async function PostPage({ params }: Props) {
  const resolvedParams = await params;

  const product: Product | null = await getProductById(resolvedParams.id);

  if (!product) return notFound();

  return (
    <>
      <NavBar />
      <div className="max-w-4xl mx-auto p-8 bg-pink-50 rounded-lg shadow-lg my-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-md border border-pink-300">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="text-5xl font-extrabold text-pink-700 mb-6 border-b-4 border-pink-400 pb-2">
              {product.name}
            </h1>
            <p className="text-gray-800 text-lg mb-8 leading-relaxed">
              {product.description}
            </p>
            <p className="text-4xl text-pink-600 font-bold mb-8">
              ¥{product.price.toLocaleString()}
            </p>
            <AddToCartButton
              product={{
                id: product.id,
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl,
              }}
            />

            {/* お気に入りボタン */}
            <FavoriteButton productId={product.id} />
            {/* お気に入りボタン */}
          </div>
        </div>
      </div>
    </>
  );
}

import { fetchProducts } from 'lib/fetchProducts';
import { ProductsList } from 'components/ProductsList';
import NavBar from 'components/NavBar';

export default async function HomePage() {
  const products = await fetchProducts();

  return (
    <main className="min-h-screen bg-pink-50">
      {/* ナビゲーション */}
      <NavBar />

      {/* 商品一覧 */}
      <section className="max-w-7xl mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-6 text-black">商品一覧</h2>
        <ProductsList products={products} />
      </section>
    </main>
  );
}

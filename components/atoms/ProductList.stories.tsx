// components/organisms/ProductsList.stories.tsx

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ProductsList } from 'components/ProductsList';
import type { Product } from 'lib/fetchProducts';

const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Tシャツ',
    price: 1500,
    imageUrl: '/images/shir.jpeg',
    description: 'Good texture',
  },
  {
    id: '2',
    name: 'スニーカー',
    price: 8000,
    imageUrl: '/images/sneakers.jpg',
    description: 'excellent',
  },
];

const meta: Meta<typeof ProductsList> = {
  title: 'Organisms/ProductsList',
  component: ProductsList,
  parameters: {
    docs: {
      description: {
        component: '商品一覧をグリッド表示するコンポーネント',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof ProductsList>;

export const Default: Story = {
  args: {
    products: sampleProducts,
  },
};

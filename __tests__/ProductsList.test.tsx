// __tests__/ProductsList.test.tsx
import { render, screen } from '@testing-library/react';
import { ProductsList } from 'components/ProductsList';
import '@testing-library/jest-dom';

const mockProducts = [
  {
    id: '1',
    name: 'モック商品1',
    description: 'これはテスト用の商品です',
    price: 1980,
    imageUrl: '/dummy.jpg',
  },
  {
    id: '2',
    name: 'モック商品2',
    description: '2つ目の商品です',
    price: 2500,
    imageUrl: '/dummy2.jpg',
  },
];

describe('ProductsList', () => {
  it('props で渡された商品がすべて表示される', () => {
    render(<ProductsList products={mockProducts} />);

    expect(screen.getByText('モック商品1')).toBeInTheDocument();
    expect(screen.getByText('モック商品2')).toBeInTheDocument();
    expect(screen.getByText('これはテスト用の商品です')).toBeInTheDocument();
    expect(screen.getByText('2つ目の商品です')).toBeInTheDocument();
    expect(screen.getByText('¥1,980')).toBeInTheDocument();
    expect(screen.getByText('¥2,500')).toBeInTheDocument();
  });
});

import { rest } from 'msw';

export const handlers = [
  rest.get('/api/products', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: '1',
          name: 'テスト商品1',
          description: 'これはテスト用の説明です。',
          price: 1000,
          imageUrl: '/test-product1.jpg',
        },
        {
          id: '2',
          name: 'テスト商品2',
          description: 'もう一つのテスト商品です。',
          price: 2000,
          imageUrl: '/test-product2.jpg',
        },
      ])
    );
  }),
];

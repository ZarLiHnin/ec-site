import { renderHook } from '@testing-library/react';
import { useCartStore } from 'store/cartStore';
import { useCartTotal } from './useCartTotal';

jest.mock('store/cartStore');

describe('useCartTotal', () => {
  it('returns correct total', () => {
    (useCartStore as unknown as jest.Mock).mockImplementation((selector) => {
      return selector({
        items: [
          { id: '1', price: 1000, quantity: 2 },
          { id: '2', price: 500, quantity: 1 },
        ],
      });
    });

    const { result } = renderHook(() => useCartTotal());
    expect(result.current).toBe(2500);
  });
});

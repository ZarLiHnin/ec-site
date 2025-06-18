import { formatPrice } from './format';

describe('formatPrice', () => {
  it('formats number to yen string', () => {
    expect(formatPrice(1000)).toBe('¥1,000');
    expect(formatPrice(999999)).toBe('¥999,999');
  });
});

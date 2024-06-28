import { calculateMouseParallax } from '../src/old';

describe('calculateMouseParallax is a basically a math function', () => {
  test('Should return [0, 0] when all inputs are 0', () => {
    expect(calculateMouseParallax(0, 0, 0, 0)).toEqual([0, 0]);
    expect(calculateMouseParallax(50, 50, 0, 0)).toEqual([0, 0]);
  });

  test('Should return 0 when width or height are 0', () => {
    expect(calculateMouseParallax(50, 50, 0, 200)).toEqual([0, -0.25]);
    expect(calculateMouseParallax(50, 50, 200, 0)).toEqual([-0.25, 0]);
  });

  test('Should calculate correct values for non-zero inputs', () => {
    expect(calculateMouseParallax(50, 50, 200, 200)).toEqual([-0.25, -0.25]);
    expect(calculateMouseParallax(-50, -50, 200, 200)).toEqual([-0.75, -0.75]);
    expect(calculateMouseParallax(300, 300, 200, 200)).toEqual([1, 1]);
  });

  test('Should handle non-integer values for inputs', () => {
    expect(calculateMouseParallax(75.5, 125.5, 200, 200)).toEqual([-0.1225, 0.1275]);
  });

  test('Should handle very large values for x and y', () => {
    expect(calculateMouseParallax(1e6, 1e6, 200, 200)).toEqual([4999.5, 4999.5]);
  });

  test('Should handle very small values for width and height', () => {
    expect(calculateMouseParallax(50, 50, 1, 1)).toEqual([49.5, 49.5]);
  });
});

const { maximumEligibleAmount } = require('../../src/lib/loan-helpers');

describe('maximumEligibleAmount', () => {
  describe('should return undefined', () => {
    test('when input is more than 100', () => {
      expect(maximumEligibleAmount(101)).toBe(undefined);
    });
    test('when input is less than 0', () => {
      expect(maximumEligibleAmount(-1)).toBe(undefined);
    });
  });

  test('should return integer', () => {
    expect(typeof maximumEligibleAmount(63)).toBe('number');
  });

  test('should return correct eligible amount', () => {
    expect(maximumEligibleAmount(63)).toBe(625000);
  });
});

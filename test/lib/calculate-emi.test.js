const { calculateEmi } = require('../../src/lib/calculate-emi');
// const models = require('../../models');

describe('calculateEmi', () => {
  test('should return a Promise', () => {
    expect(calculateEmi(1, 1))
      .toBeInstanceOf(Promise);
  });
});

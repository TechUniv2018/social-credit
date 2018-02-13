const { calculateEmi } = require('../../src/lib/calculate-emi');
const models = require('../../models');

describe('calculateEmi', () => {
  test('should return a Promise', () => {
    expect(calculateEmi(1, 1))
      .toBeInstanceOf(Promise);
  });
  describe('Given a null loanId', () => {
    test('should return \'Invalid Id\'', (done) => {
      expect.assertions(1);

      calculateEmi(1, null)
        .then(() => {

        })
        .catch((e) => {
          expect(e.message).toEqual('Invalid Id');
          done();
        });
    });
  });
  describe('Given invalid userId', () => {
    test('should return \'Invalid Id\'', (done) => {
      expect.assertions(1);

      calculateEmi(2, 1)
        .then(() => {
        }).catch((e) => {
          expect(e.message).toEqual('Invalid Id');
          done();
        });
    });
  });
  describe('Given valid id', () => {
    test('should resolve with emi', (done) => {
      expect.assertions(1);

      calculateEmi(1, 1)
        .then((emi) => {
          expect(typeof (emi)).toBe('number');
          done();
        });
    });
  });
});

const { userLoans } = require('../../src/lib/user-helpers');
const models = require('../../models');

describe('userLoans', () => {
  test('should return a Promise', () => {
    expect(userLoans(1))
      .toBeInstanceOf(Promise);
  });

  describe('should resolve to an array of objects', () => {
    test('with id, userId, outstandingAmount, totalAmount, installmentCount', (done) => {
      expect.assertions(1);

      userLoans(1)
        .then((loans) => {
          if (loans.length > 0) {
            expect(loans[0]).toEqual(expect.objectContaining({
              id: expect.any(Number),
              userId: expect.any(Number),
              outstandingAmount: expect.any(Number),
              totalAmount: expect.any(Number),
              installmentCount: expect.any(Number),
              createdAt: expect.any(Date),
              updatedAt: expect.any(Date),
            }));
            done();
          }
        })
        .catch((e) => { throw e; });
    });
  });

  describe('should resolve with all loans from the correct user', () => {
    test('when valid userId is passed', (done) => {
      const userId = 1;
      userLoans(userId)
        .then((loans) => {
          loans.forEach((loan) => {
            expect(loan.userId === userId);
          });
          done();
        })
        .catch((e) => { throw e; });
    });
  });

  describe('should return correct number of loan objects', () => {
    test('when valid userId is passed', (done) => {
      expect.assertions(1);

      const userId = 1;
      userLoans(userId)
        .then(loans =>
          models.loans.count({
            where: {
              userId,
            },
          })
            .then((count) => {
              expect(count).toBe(loans.length);
              done();
            })
            .catch((e) => { throw e; }))
        .catch((e) => { throw e; });
    });
  });

  describe('should reject with error message', () => {
    test('when invalid userId is passed', (done) => {
      expect.assertions(1);

      userLoans(-12)
        .then(() => {

        })
        .catch((e) => {
          expect(e.message).toEqual('Invalid userId.');
          done();
        });
    });
  });
});

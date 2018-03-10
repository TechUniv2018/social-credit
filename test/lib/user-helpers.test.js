const { userLoans } = require('../../src/lib/user-helpers');
const models = require('../../models');

const userId = 3;

describe('userLoans', () => {
  test('should return a Promise', () => {
    expect(userLoans(userId))
      .toBeInstanceOf(Promise);
  });

  describe('should resolve to an array of objects', () => {
    test('with id, userId, outstandingAmount, totalAmount, installmentCount', async () => {
      expect.assertions(1);
      await models.loans.create({
        userId,
        outstandingAmount: 100,
        totalAmount: 100,
      });
      const loans = await userLoans(userId);
      if (loans.length > 0) {
        expect(loans[0]).toEqual(expect.objectContaining({
          id: expect.any(Number),
          userId: expect.any(Number),
          outstandingAmount: expect.any(Number),
          totalAmount: expect.any(Number),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }));
      } else {
        throw new Error('Could not find loan');
      }
    });
  });

  describe('should resolve with all loans from the correct user', () => {
    test('when valid userId is passed', (done) => {
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

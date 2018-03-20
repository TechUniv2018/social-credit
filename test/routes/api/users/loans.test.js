const supertest = require('supertest');
const models = require('../../../../models');
const server = require('../../../../src/server');

const userId = 5;

describe('route GET /api/users/loans', () => {
  beforeAll(async () => {
    await models.loans.destroy({ truncate: true });
  });
  describe('should return 200 statusCode', () => {
    test('when access token is valid', (done) => {
      supertest(server.listener)
        .get('/api/users/loans')
        .set('accesstoken', process.env.ACCESS_TOKEN)
        .then((response) => {
          expect(response.body.statusCode).toBe(200);
          done();
        })
        .catch((e) => { throw e; });
    });
  });

  describe('should return 400 statusCode', () => {
    test('when access token is invalid', (done) => {
      supertest(server.listener)
        .get('/api/users/loans')
        .set('accesstoken', 'some-invalid-token')
        .then((response) => {
          expect(response.body).toEqual({
            error: 'Invalid token',
            message: 'Invalid user access token',
            statusCode: 400,
          });
          done();
        })
        .catch((e) => { throw e; });
    });
  });

  describe('should return 200 statusCode', () => {
    test('when access token is valid', (done) => {
      supertest(server.listener)
        .get('/api/users/loans')
        .set('accesstoken', process.env.ACCESS_TOKEN)
        .then((response) => {
          expect(response.body.statusCode).toBe(200);
          done();
        })
        .catch((e) => { throw e; });
    });
  });

  describe('should return correct number of loan objects', () => {
    test('when access token is valid', (done) => {
      supertest(server.listener)
        .get('/api/users/loans')
        .set('accesstoken', process.env.ACCESS_TOKEN)
        .then(response =>
          models.loans.count({
            where: {
              userId,
            },
          })
            .then((count) => {
              expect(response.body.data.length).toBe(count);
              done();
            })
            .catch((e) => { throw e; }))
        .catch((e) => { throw e; });
    });
  });
});

describe('route POST /api/users/loans', () => {
  afterEach(() => models.loans.destroy({ where: { userId } }));

  describe('should return 400 statusCode', () => {
    test('when user access token is invalid', () =>
      supertest(server.listener)
        .post('/api/users/loans')
        .send({})
        .set('accesstoken', 'invalid-access-token')
        .then((response) => {
          expect(response.body.statusCode).toBe(400);
        })
        .catch((e) => { throw e; }));

    test('when user request for loan more than maximum eligible amount', () =>
      models.users.findOne({ where: { id: userId } })
        .then(user => user.updateAttributes({ socialScore: 63 }))
        .then(() => supertest(server.listener)
          .post('/api/users/loans')
          .send({
            totalAmount: 800000,
            totalInstallments: 12,
          })
          .set('accesstoken', process.env.ACCESS_TOKEN)
          .then((response) => {
            expect(response.body.statusCode).toBe(400);
            expect(response.body.message).toBe('You are eligible for a maximum loan amount of 625000 INR.');
          }))
        .then(() => models.users.findOne({ where: { id: userId } }))
        .then(user => user.updateAttributes({ socialScore: 100 }))
        .catch((e) => { throw e; }));

    describe('validation tests', () => {
      test('when totalAmount and totalInstallments are not present in payload', () =>
        supertest(server.listener)
          .post('/api/users/loans')
          .send({})
          .set('accesstoken', process.env.ACCESS_TOKEN)
          .then((response) => {
            expect(response.body.statusCode).toBe(400);
          })
          .catch((e) => { throw e; }));

      describe('totalAmount', () => {
        test('when totalAmount is less than 25000', () =>
          supertest(server.listener)
            .post('/api/users/loans')
            .send({
              totalAmount: 20000,
              totalInstallments: 12,
            })
            .set('accesstoken', process.env.ACCESS_TOKEN)
            .then((response) => {
              expect(response.body.statusCode).toBe(400);
            })
            .catch((e) => { throw e; }));

        test('when totalAmount is more than 1000000', () =>
          supertest(server.listener)
            .post('/api/users/loans')
            .send({
              totalAmount: 1100000,
              totalInstallments: 12,
            })
            .set('accesstoken', process.env.ACCESS_TOKEN)
            .then((response) => {
              expect(response.body.statusCode).toBe(400);
            })
            .catch((e) => { throw e; }));

        test('when totalAmount is not a multiple of 25000', () =>
          supertest(server.listener)
            .post('/api/users/loans', {
              totalAmount: 7500020,
              totalInstallments: 12,
            })
            .set('accesstoken', process.env.ACCESS_TOKEN)
            .then((response) => {
              expect(response.body.statusCode).toBe(400);
            })
            .catch((e) => { throw e; }));
      });

      describe('totalInstallments', () => {
        test('when totalInstallments is less than 12', () =>
          supertest(server.listener)
            .post('/api/users/loans')
            .send({
              totalAmount: 125000,
              totalInstallments: 6,
            })
            .set('accesstoken', process.env.ACCESS_TOKEN)
            .then((response) => {
              expect(response.body.statusCode).toBe(400);
            })
            .catch((e) => { throw e; }));

        test('when totalInstallments is more than 36', () =>
          supertest(server.listener)
            .post('/api/users/loans')
            .send({
              totalAmount: 100000,
              totalInstallments: 48,
            })
            .set('accesstoken', process.env.ACCESS_TOKEN)
            .then((response) => {
              expect(response.body.statusCode).toBe(400);
            })
            .catch((e) => { throw e; }));

        test('when totalInstallments is not a multiple of 6', () =>
          supertest(server.listener)
            .post('/api/users/loans')
            .send({
              totalAmount: 100000,
              totalInstallments: 19,
            })
            .set('accesstoken', process.env.ACCESS_TOKEN)
            .then((response) => {
              expect(response.body.statusCode).toBe(400);
            })
            .catch((e) => { throw e; }));
      });
    });

    describe('when user already has a loan', () => {
      beforeEach(() => {
        const totalAmount = 250000;
        const totalInstallments = 24;

        return models.loans.create({
          userId,
          totalAmount,
          totalInstallments,
          outstandingAmount: 1.1 * totalAmount,
          outstandingInstallments: totalInstallments,
        });
      });

      afterEach(() => models.loans.destroy({
        where: {
          userId,
          totalAmount: 250000,
          totalInstallments: 24,
        },
      }));

      test('with outstandingAmount greater than 0', () =>
        supertest(server.listener)
          .post('/api/users/loans')
          .send({
            totalAmount: 100000,
            totalInstallments: 24,
          })
          .set('accesstoken', process.env.ACCESS_TOKEN)
          .then((response) => {
            expect(response.body.statusCode).toBe(400);
          }));
    });
  });

  describe('should return 201 statusCode', () => {
    beforeEach(() => models.loans.destroy({
      where: {
        userId,
      },
    }));

    test('when user applies for a loan', () =>
      supertest(server.listener)
        .post('/api/users/loans')
        .set('accesstoken', process.env.ACCESS_TOKEN)
        .send({
          totalAmount: 100000,
          totalInstallments: 24,
        })
        .then((response) => {
          expect(response.body.statusCode).toBe(201);
        }));
  });

  describe('should return valid loan object', () => {
    beforeEach(() => models.loans.destroy({
      where: { userId },
    }));

    test('when user applies for a loan', (done) => {
      supertest(server.listener)
        .post('/api/users/loans')
        .send({
          totalAmount: 100000,
          totalInstallments: 12,
        })
        .set('accesstoken', process.env.ACCESS_TOKEN)
        .then(response => Promise.all([response, models.loans.findOne({
          where: {
            userId,
          },
        })]))
        .then(([response, loan]) => {
          expect({
            totalAmount: loan.totalAmount,
            outstandingAmount: loan.outstandingAmount,
            outstandingInstallments: loan.outstandingInstallments,
            totalInstallments: loan.totalInstallments,
          }).toEqual({
            ...response.body.data,
          });
          done();
        });
    });
  });

  describe('should return loan object with correct values', () => {
    beforeEach(() => models.loans.destroy({
      where: { userId },
    }));

    test('when user applies for a loan', (done) => {
      const totalAmount = 250000;
      const totalInstallments = 12;

      const emi = Math.round(((1.1 * totalAmount) / totalInstallments) / 10) * 10;

      supertest(server.listener)
        .post('/api/users/loans')
        .send({
          totalAmount,
          totalInstallments,
        })
        .set('accesstoken', process.env.ACCESS_TOKEN)
        .then((response) => {
          expect(response.body.data.outstandingAmount).toBe(Math.round(emi * totalInstallments));
          expect(response.body.data.outstandingInstallments).toBe(totalInstallments);
          done();
        });
    });
  });
});

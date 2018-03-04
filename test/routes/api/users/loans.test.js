const supertest = require('supertest');
const models = require('../../../../models');
const server = require('../../../../src/server');

describe('route GET /api/users/loans', () => {
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
              userId: 5,
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
  describe('should return 400 statusCode', () => {
    describe('validation tests', () => {
      test('when totalAmount and totalInstallments are not present in payload', () =>
        supertest(server.listener)
          .post('/api/users/loans', {})
          .set('accesstoken', process.env.ACCESS_TOKEN)
          .then((response) => {
            expect(response.body.statusCode).toBe(400);
          })
          .catch((e) => { throw e; }));

      describe('totalAmount', () => {
        test('when totalAmount is less than 100000', () =>
          supertest(server.listener)
            .post('/api/users/loans', {
              totalAmount: 75000,
              totalInstallments: 12,
            })
            .set('accesstoken', process.env.ACCESS_TOKEN)
            .then((response) => {
              expect(response.body.statusCode).toBe(400);
            })
            .catch((e) => { throw e; }));

        test('when totalAmount is more than 1000000', () =>
          supertest(server.listener)
            .post('/api/users/loans', {
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
            .post('/api/users/loans', {
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
            .post('/api/users/loans', {
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
            .post('/api/users/loans', {
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
  });
});

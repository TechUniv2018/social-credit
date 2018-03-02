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
              userId: 1,
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

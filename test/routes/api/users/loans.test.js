const supertest = require('supertest');
const models = require('../../../../models');
const server = require('../../../../src/server');

describe('route /api/users/{userId}/loans', () => {
  describe('should return 200 statusCode', () => {
    test('when valid userId is passed', (done) => {
      supertest(server.listener)
        .get('/api/users/1/loans')
        .then((response) => {
          expect(response.body.statusCode).toBe(200);
          done();
        })
        .catch((e) => { throw e; });
    });
  });

  describe('should return 400 statusCode', () => {
    test('when invalid userId is passed', (done) => {
      supertest(server.listener)
        .get('/api/users/-120/loans')
        .then((response) => {
          expect(response.body).toEqual({
            statusCode: 400,
            data: {
              reason: 'Invalid userId.',
            },
          });
          done();
        })
        .catch((e) => { throw e; });
    });
  });

  describe('should return 200 statusCode', () => {
    test('when valid userId is passed', (done) => {
      supertest(server.listener)
        .get('/api/users/1/loans')
        .then((response) => {
          expect(response.body.statusCode).toBe(200);
          done();
        })
        .catch((e) => { throw e; });
    });
  });
});

describe('should return correct number of loan objects', () => {
  test('when valid userId is passed', (done) => {
    supertest(server.listener)
      .get('/api/users/1/loans')
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

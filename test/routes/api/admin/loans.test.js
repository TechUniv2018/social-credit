const supertest = require('supertest');
const models = require('../../../../models');
const server = require('../../../../src/server');

describe('route GET /api/admin/loans', () => {
  describe('should return 200 statusCode', () => {
    test('when access token is valid', (done) => {
      supertest(server.listener)
        .get('/api/admin/loans')
        .then((response) => {
          expect(response.body.statusCode).toBe(200);
          done();
        })
        .catch((e) => { throw e; });
    });
  });
});

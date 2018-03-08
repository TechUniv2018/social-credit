const supertest = require('supertest');
const models = require('../../../../models');
const server = require('../../../../src/server');

describe('route GET /api/admin/loans', () => {
  test('should return 200 statusCode', (done) => {
    supertest(server.listener)
      .get('/api/admin/loans')
      .then((response) => {
        expect(response.body.statusCode).toBe(200);
        done();
      })
      .catch((e) => { throw e; });
  });

  test('should return correct number of users who has taken loans', (done) => {
    supertest(server.listener)
      .get('/api/admin/loans')
      .then(response => models.loans.count()
        .then((count) => {
          expect(response.body.data.length).toBe(count);
          done();
        }))
      .catch((e) => { throw e; });
  });
});

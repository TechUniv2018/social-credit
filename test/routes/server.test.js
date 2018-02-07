const server = require('../../src/server');
const supertest = require('supertest');

describe('Server should have the route', () => {
  it('/api/maxAmount', (done) => {
    supertest(server.listener)
      .get('/api/maxAmount')
      .then((response) => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
  describe('With contents in', () => {
    it('/api/maxAmount', (done) => {
      supertest(server.listener)
        .get('/api/maxAmount')
        .then((response) => {
          const resultKeys = ['amount', 'currency', 'createdAt', 'updatedAt', 'id'];
          expect(Object.keys(response.body).sort()).toEqual(resultKeys.sort());
          done();
        });
    });
  });
});

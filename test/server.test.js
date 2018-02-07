const server = require('../src/server');
const supertest = require('supertest');

describe('Server should have the route', () => {
  it('/login.html', (done) => {
    supertest(server.listener)
      .get('/login.html')
      .then((response) => {
        expect(response.statusCode).toBe(200);
        done();
      })
      .catch(console.log);
  });
  it('/index.html', (done) => {
    supertest(server.listener)
      .get('/index.html')
      .then((response) => {
        expect(response.statusCode).toBe(200);
        done();
      })
      .catch(console.log);
  });
  it('/admin', (done) => {
    supertest(server.listener)
      .get('/admin')
      .then((response) => {
        expect(response.statusCode).toBe(200);
        done();
      })
      .catch(console.log);
  });
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

const server = require('../server/server');
const supertest = require('supertest');

describe('Server should have the route', () => {
  it('/admin', (done) => {
    supertest(server.listener)
      .get('/admin')
      .then((response) => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
  it('/index.html', (done) => {
    supertest(server.listener)
      .get('/index.html')
      .then((response) => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});


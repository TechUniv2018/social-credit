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
  it('/dashboard.html', (done) => {
    supertest(server.listener)
      .get('/dashboard.html')
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
});


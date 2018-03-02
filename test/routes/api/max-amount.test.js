const { matchers } = require('jest-json-schema');

const server = require('../../../src/server');
const supertest = require('supertest');

expect.extend(matchers);

describe('GET request: Server should have the route', () => {
  test('/api/max-amount', (done) => {
    supertest(server.listener)
      .get('/api/max-amount')
      .then((response) => {
        expect(response.body.statusCode).toBe(200);
        done();
      });
  });
  describe('With contents in', () => {
    test('/api/max-amount', (done) => {
      supertest(server.listener)
        .get('/api/max-amount')
        .then((response) => {
          const resultKeys = ['amount', 'currency', 'createdAt', 'updatedAt', 'id'];
          expect(Object.keys(response.body.data).sort()).toEqual(resultKeys.sort());
          done();
        });
    });
  });
  describe('With same signature', () => {
    test('/api/max-amount', (done) => {
      supertest(server.listener)
        .get('/api/max-amount')
        .then((response) => {
          const banks = response.body.data;

          expect(banks).toMatchObject(expect.objectContaining({
            id: expect.any(Number),
            amount: expect.any(Number),
            currency: expect.any(String),
          }));
          done();
        });
    });
  });
});


describe('POST request: Server should return 200 statusCode', () => {
  test('when amount and currency are valid', (done) => {
    const bank = { amount: 6000000, currency: 'INR' };
    supertest(server.listener)
      .post('/api/max-amount')
      .send(bank)
      .then((response) => {
        expect(response.body.statusCode).toBe(200);
        done();
      });
  });
});

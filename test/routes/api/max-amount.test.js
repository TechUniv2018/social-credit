const { matchers } = require('jest-json-schema');

const server = require('../../../src/server');
const supertest = require('supertest');

expect.extend(matchers);

describe('GET request: Server should have the route', () => {
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
  describe('With same signature', () => {
    it('/api/maxAmount', (done) => {
      supertest(server.listener)
        .get('/api/maxAmount')
        .then((response) => {
          const banks = response.body;

          const schema = {
            properties: {
              id: { type: 'number' },
              amount: { type: 'number' },
              currency: { type: 'string' },
              createdAt: { type: 'string' },
              updatedAt: { type: 'string' },
            },
            required: ['id', 'amount', 'currency', 'createdAt', 'updatedAt'],
          };
          expect(banks).toMatchSchema(schema);
          done();
        });
    });
  });
});


describe('POST request: Server should have the route', () => {
  it('/api/maxAmount', (done) => {
    const bank = { amount: 6000000, currency: 'INR' };
    supertest(server.listener)
      .post('/api/maxAmount')
      .send(bank)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

const supertest = require('supertest');

const server = require('../../../../src/server');

describe('When the user clicks the pay loan button', () => {
  it('should pay back the current loan for that user', (done) => {
    const requestObj = {
      userid: 'user1',
    };
    supertest(server.listener)
      .post('/api/users/pay-loan')
      .send(requestObj)
      .then((response) => {
        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBeDefined();
        done();
      });
  });
  it('return error if invalid user', (done) => {
    const requestObj = {
      userid: 'DOES_NOT_EXIST',
    };
    supertest(server.listener)
      .post('/api/users/pay-loan')
      .send(requestObj)
      .then((response) => {
        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBeDefined();
        done();
      });
  });
});

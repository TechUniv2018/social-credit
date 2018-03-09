const supertest = require('supertest');
const server = require('../../../../src/server');

describe('route POST /api/user/emi', () => {
  describe('should return 200 statusCode', () => {
    test('when user does not have a loan', (done) => {
      supertest(server.listener)
        .post('/api/users/emi')
        .set('accesstoken', process.env.ACCESS_TOKEN)
        .send({
          emi: 2000,
        })
        .then((response) => {
          expect(response.body.statusCode).toBe(400);
          done();
        })
        .catch((e) => { throw e; });
    });
  });
});

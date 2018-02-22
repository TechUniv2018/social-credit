const supertest = require('supertest');
const server = require('../../../../src/server');

describe('route /api/users/login', () => {
  describe('should return 200 statusCode', () => {
    test('when invalid accesstoken is passed', (done) => {
      supertest(server.listener)
        .post('/api/users/login')
        .set('accesstoken', 'IAmInvalid')
        .then((response) => {
          expect(response.body.statusCode).toBe(401);
          done();
        })
        .catch((e) => { throw e; });
    });
  });
});

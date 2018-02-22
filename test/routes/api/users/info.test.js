const supertest = require('supertest');
const server = require('../../../../src/server');

describe('/api/users/info', () => {
  it('when invalid accesstoken is passed', (done) => {
    supertest(server.listener)
      .get('/api/users/info')
      .set('accesstoken', 'INVALID')
      .then((response) => {
        expect(response.body.statusCode).toBe(401);
        done();
      })
      .catch((e) => { throw e; });
  });
});

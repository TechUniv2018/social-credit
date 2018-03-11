const supertest = require('supertest');

const server = require('../../../../src/server');

describe('/api/users/info', () => {
  it('when invalid accesstoken is passed, login should fail', (done) => {
    supertest(server.listener)
      .get('/api/users/info')
      .set('accesstoken', 'INVALID')
      .then((response) => {
        expect(response.body.statusCode).toBe(401);
        done();
      })
      .catch((e) => { throw e; });
  });

  it('when a valid accesstoken is passed, it should match schema', (done) => {
    supertest(server.listener)
      .get('/api/users/info')
      .set('accesstoken', process.env.ACCESS_TOKEN)
      .then((response) => {
        expect(response.body).toMatchSnapshot();
        done();
      })
      .catch((e) => { throw e; });
  });
});

const supertest = require('supertest');

const server = require('../../../../src/server');

const models = require('../../../../models');

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

  it('when a valid accesstoken is passed, it should match schema', async () => {
    await models.users.update(
      {
        socialScore: 50,
      },
      {
        where: {
          firstName: 'Shachi',
        },
      },
    );
    await models.twitters.destroy({ truncate: true });
    await supertest(server.listener)
      .get('/api/users/info')
      .set('accesstoken', process.env.ACCESS_TOKEN)
      .then((response) => {
        expect(response.body).toMatchSnapshot();
      })
      .catch((e) => { throw e; });
  });
});

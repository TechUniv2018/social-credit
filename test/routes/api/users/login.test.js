const supertest = require('supertest');
const server = require('../../../../src/server');
const models = require('../../../../models');

describe('route /api/users/login', () => {
  describe('should return 401 statusCode', () => {
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

    it('Should find or create a new user when a valid token is passed', (done) => {
      models.users.destroy({
        where: {
          firstName: 'Shachi',
        },
      })
        .then(() => models.facebooks.destroy({
          where: {
            id: '2051629538452614',
          },
        }))
        .then(() => supertest(server.listener)
          .post('/api/users/login')
          .set('accesstoken', process.env.ACCESS_TOKEN)
          .then((response) => {
            expect(response.body.statusCode).toBe(200);
            expect(response.body.success).toBeTruthy();
          }))
        .then(() => supertest(server.listener)
          .post('/api/users/login')
          .set('accesstoken', process.env.ACCESS_TOKEN)
          .then((response) => {
            expect(response.body.statusCode).toBe(200);
            expect(response.body.success).toBeTruthy();
            done();
          }));
    });
  });
});

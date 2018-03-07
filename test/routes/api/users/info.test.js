const supertest = require('supertest');
const { matchers } = require('jest-json-schema');

expect.extend(matchers);

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
    const schema = {
      properties: {
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        socialScore: { type: 'number' },
        socialScoreBreakdown: {
          properties: {
            facebook: {
              properties: {
                numberOfFbFriends: { type: 'number' },
              },
              required: ['numberOfFbFriends'],
            },
          },
          required: ['facebook'],
        },
      },
      required: ['firstName', 'lastName', 'socialScore', 'socialScoreBreakdown'],
    };
    supertest(server.listener)
      .get('/api/users/info')
      .set('accesstoken', process.env.ACCESS_TOKEN)
      .then((response) => {
        expect(response.body.statusCode).toBe(200);
        expect(response.body.data).toMatchSchema(schema);
        done();
      })
      .catch((e) => { throw e; });
  });
});

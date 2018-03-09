const supertest = require('supertest');
const server = require('../../../../src/server');

describe('When accesstoken and accesstoken secret is passed', () => {
  it('which is valid, then it should verify credentials', (done) => {
    const accessToken = '318307922-qSdIYyutY51Y3UZQcPVMAGK8DC1QUYAdR0g6dnPs';
    const accessTokenSecret = 'RGIlaqIVjDYMuAks90gr7isOgY4BqQ4JZK8RLMn7S8qUE';

    supertest(server.listener)
      .post('/api/users/twitter')
      .set('access_token', accessToken)
      .set('access_token_secret', accessTokenSecret)
      .then((response) => {
        expect(response.body.statusCode).toBe(200);
        expect(response.body.screenName).toBe('SouradeepNanda');
        expect(typeof response.body.score).toBe('number');
        done();
      })
      .catch((e) => { throw e; });
  });
  it('which is invalid, then it should reject', (done) => {
    const accessToken = 'invalid';
    const accessTokenSecret = 'invalid';
    supertest(server.listener)
      .post('/api/users/twitter')
      .set('access_token', accessToken)
      .set('access_token_secret', accessTokenSecret)
      .then((response) => {
        expect(response.body.statusCode).toBe(401);
        expect(response.body.screenName).toBe('');
        done();
      })
      .catch((e) => { throw e; });
  });
});

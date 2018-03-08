const {
  getTwitterScore,
  verifyCredentials,
} = require('../../src/lib/twitter-helpers');

describe('When accesstoken and accesstoken secret is passed', () => {
  it('which is valid, then it should verify credentials', (done) => {
    const accessToken = '318307922-qSdIYyutY51Y3UZQcPVMAGK8DC1QUYAdR0g6dnPs';
    const accessTokenSecret = 'RGIlaqIVjDYMuAks90gr7isOgY4BqQ4JZK8RLMn7S8qUE';
    verifyCredentials({
      access_token: accessToken,
      access_token_secret: accessTokenSecret,
    }, (screenName) => {
      expect(screenName).toBe('SouradeepNanda');
      done();
    });
  });
  it('which is invalid, then it should reject', (done) => {
    const accessToken = 'invalid';
    const accessTokenSecret = 'invalid';
    verifyCredentials({
      access_token: accessToken,
      access_token_secret: accessTokenSecret,
    }, (res) => {
      expect(res).toBeUndefined();
      done();
    });
  });
});

describe('When a screen_name is passed to getTwitterScore function', () => {
  it('of a user with <= 5000 followers', (done) => {
    getTwitterScore('SouradeepNanda', (score) => {
      expect(typeof score).toBe('number');
      done();
    });
  });
  it('of a user with > 5000 followers', (done) => {
    getTwitterScore('fchollet', (score) => {
      expect(typeof score).toBe('number');
      done();
    });
  });
  it('of an invalid user', (done) => {
    getTwitterScore('INVALID_USER_000000', (err) => {
      expect(err.message).toBeDefined();
      done();
    });
  });
});

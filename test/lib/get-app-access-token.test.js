const getAppAccessToken = require('../../src/lib/get-app-access-token');

describe('The get app access token helper function should', () => {
  it('return a promise which has the app access token', (done) => {
    getAppAccessToken().then((accessToken) => {
      expect(typeof accessToken).toBe('string');
      expect(accessToken.length).toBeGreaterThan(0);
      done();
    });
  });
});


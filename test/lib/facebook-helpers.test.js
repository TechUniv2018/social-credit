const { getAppAccessToken, inspectUserAccessToken } = require('../../src/lib/facebook-helpers');

describe('The get app access token helper function should', () => {
  it('return a promise which has the app access token', (done) => {
    getAppAccessToken().then((accessToken) => {
      expect(typeof accessToken).toBe('string');
      expect(accessToken.length).toBeGreaterThan(0);
      done();
    });
  });
});

describe('inspectUserAccessToken', () => {
  it('should return a promise', () => {
    expect(inspectUserAccessToken('accesstoken')).toBeInstanceOf(Promise);
  });

  describe('should resolve to object with isValid false and userId undefined', () => {
    it('when access token passed is invalid', (done) => {
      const invalidToken = 'invalidAccessToken';

      inspectUserAccessToken(invalidToken)
        .then((result) => {
          expect(result.isValid).toBe(false);
          expect(result.userId).toBe(undefined);
          done();
        });
    });
  });
});

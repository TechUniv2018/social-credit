// const twitterSecret = require('./twitter-config-test.json');

const {
  getTwitterScore,
} = require('../../src/lib/twitter-helpers');

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

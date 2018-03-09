const {
  getTwitterScore,
  verifyCredentials,
  getScoreFromDb,
  saveScoreIntoDb,
  doesAccountExist,
  insertEntry,
} = require('../../src/lib/twitter-helpers');

const models = require('../../models');

describe('The getScoreFromDb and saveScoreIntoDb functions should', () => {
  it('read and save scores into db', async () => {
    const screenName = 'SouradeepNanda';
    const oldScore = await getScoreFromDb(screenName);
    const newScore = oldScore + 1;
    await saveScoreIntoDb('SouradeepNanda', newScore);
    const fetchedScore = await getScoreFromDb(screenName);
    expect(fetchedScore).toBe(oldScore + 1);
  });
});

describe('The doesAccountExist function should', () => {
  it('return true if account exists', async () => {
    const val = await doesAccountExist('SouradeepNanda');
    expect(val).toBeTruthy();
  });
  it('return false if account does not exist', async () => {
    const val = await doesAccountExist('');
    expect(val).toBeFalsy();
  });
});

describe('The insertEntry function should', () => {
  it('insert a new entry into the db', async () => {
    await models.twitters.destroy({ truncate: true });
    await insertEntry('SouradeepNanda', 3);
    await insertEntry('SouradeepNanda', 3);
    const entries = await models.twitters.findAll();
    expect(entries.length).toBe(1);
  });
});

describe('The getSocialScoreFromDb function should', () => {
  it('return the social score using screenName if it exists', (done) => {
    getScoreFromDb('SouradeepNanda')
      .then((score) => {
        expect(typeof score).toBe('number');
        done();
      });
  });
  it('return null if screenName does not exist', (done) => {
    getScoreFromDb('')
      .then((score) => {
        expect(score).toBeNull();
        done();
      });
  });
});

describe('When accesstoken and accesstoken secret is passed', () => {
  it('which is valid, then it should verify credentials', (done) => {
    const accessToken = '318307922-qSdIYyutY51Y3UZQcPVMAGK8DC1QUYAdR0g6dnPs';
    const accessTokenSecret = 'RGIlaqIVjDYMuAks90gr7isOgY4BqQ4JZK8RLMn7S8qUE';
    verifyCredentials({
      access_token: accessToken,
      access_token_secret: accessTokenSecret,
    }).then((screenName) => {
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
    }).then((res) => {
      expect(res).toBeUndefined();
      done();
    });
  });
});

describe('When a screen_name is passed to getTwitterScore function', () => {
  it('of a user with <= 5000 followers', (done) => {
    getTwitterScore('SouradeepNanda')
      .then((score) => {
        expect(typeof score).toBe('number');
        done();
      });
  });
  it('of a user with > 5000 followers', (done) => {
    getTwitterScore('fchollet')
      .then((score) => {
        expect(typeof score).toBe('number');
        done();
      });
  });
  it('of an invalid user', (done) => {
    getTwitterScore('INVALID_USER_000000').catch((err) => {
      expect(err.message).toBeDefined();
      done();
    });
  });
});

const supertest = require('supertest');
const server = require('../../../../src/server');
const models = require('../../../../models');

// const {
//   getScoreFromDb,
// } = require('../../../../src/lib/twitter-helpers');

const clearTwitterTable = async (screenName) => {
  await models.twitters.destroy({
    where: {
      id: screenName,
    },
  });
};

const callRoute = async (accessToken, accessTokenSecret) => {
  const response = await supertest(server.listener)
    .post('/api/users/twitter')
    .set('accesstoken', process.env.ACCESS_TOKEN)
    .set('twitter_access_token', accessToken)
    .set('twitter_access_token_secret', accessTokenSecret);
  return response.body;
};

describe('The /api/users/twitter route should', () => {
  it('update the score idempotently', async () => {
    const screenName = 'SouradeepNanda';
    const accessToken = '318307922-qSdIYyutY51Y3UZQcPVMAGK8DC1QUYAdR0g6dnPs';
    const accessTokenSecret = 'RGIlaqIVjDYMuAks90gr7isOgY4BqQ4JZK8RLMn7S8qUE';

    await clearTwitterTable(screenName);

    const body1 = await callRoute(accessToken, accessTokenSecret);
    expect(body1.statusCode).toBe(201);
    expect(body1.screenName).toBe(screenName);

    const body2 = await callRoute(accessToken, accessTokenSecret);
    expect(body2.statusCode).toBe(200);
    expect(body2.screenName).toBe(screenName);
  });
});

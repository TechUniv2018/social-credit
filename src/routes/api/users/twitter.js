const joi = require('joi');
const {
  verifyCredentials,
  getScoreFromDb,
  saveScoreIntoDb,
  doesAccountExist,
  linkTwitter,
} = require('../../../../src/lib/twitter-helpers');

/**
 * If the user does not exist in twitter table then
 * calculate twitter score and update social score
 * @param {String} screenName
 * @param {String} accesstoken
 * @returns {Number} newScore
 */
const handleNewUser = async (screenName, accesstoken) => {
  await linkTwitter(screenName, accesstoken);

  const twitterScore = 20;// await getTwitterScore(screenName);
  const oldScore = await getScoreFromDb(screenName);
  console.log('scores:', oldScore, twitterScore);

  const newScore = (oldScore + twitterScore) / 2;
  await saveScoreIntoDb(screenName, newScore);

  return newScore;
};

const handleRequest = async (headers) => {
  const screenName = await verifyCredentials({
    access_token: headers.twitter_access_token,
    access_token_secret: headers.twitter_access_token_secret,
  });
  if (screenName) {
    const userIsAlreadyConnected = await doesAccountExist(screenName);
    console.log('User exists?', userIsAlreadyConnected);
    if (userIsAlreadyConnected) {
      const score = await getScoreFromDb(screenName);
      return { screenName, score, statusCode: 200 };
    }
    const score = handleNewUser(screenName, headers.access_token);
    return { screenName, score, statusCode: 201 };
  }
  return { statusCode: 401 };
};

module.exports = [
  {
    path: '/api/users/twitter',
    method: 'POST',
    config: {
      description: 'Checks if the access token is valid and calculates twitter score',
      tags: ['api'],
      validate: {
        headers: {
          accesstoken: joi.string().required(),
          twitter_access_token: joi.string().required(),
          twitter_access_token_secret: joi.string().required(),
        },
        options: {
          allowUnknown: true,
        },
      },
    },
    handler: (request, response) => {
      handleRequest(request.headers)
        .then(response);
    },
  },
];

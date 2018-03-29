const Twit = require('twit');

const twitterSecret = require('./twitter-config');

const models = require('../../models');

const {
  inspectUserAccessToken,
} = require('../../src/lib/facebook-helpers');

const TWITTER_GLOBAL_AVERAGE_FOLLOWER_COUNT = 60;
const FOLLOWER_COUNT_OF_HIGH_PROFILE_USER = 5000;

const showData = async (screenName) => {
  const twitterSecretCopy = {
    ...twitterSecret,
    app_only_auth: true,
  };
  const T = new Twit(twitterSecretCopy);
  const response = await T.get('users/show', { user_id: screenName });
  return response.data;
};

const getFollowersList = async (screenName) => {
  const twitterSecretCopy = {
    ...twitterSecret,
    app_only_auth: true,
  };
  const T = new Twit(twitterSecretCopy);
  const listResponse = await T.get('followers/list', { user_id: screenName });
  // console.dir(listResponse);
  return listResponse.data.users;
};

/**
 * Takes a twitter screen_name and returns the number of followers of
 * followers. Makes an estimate if number of followers is greater than 5000.
 * @param {string} screenName Screen name of the twitter user
 * @param {function} callback Callback function
 * @returns {number} returns the number of followers of followers or error
 */
const getFollowersOfFollowers = async (screenName) => {
  // Only public data is used to auth is not needed
  const twitterSecretCopy = {
    ...twitterSecret,
    app_only_auth: true,
  };

  const T = new Twit(twitterSecretCopy);
  // Queries twitter for basic user info
  const response = await T.get('users/show', { user_id: screenName });
  const { data } = response;
  // If the number of followers is greater than 5000 then a single
  // twitter request would not be sufficient to count the number of followers
  // Multiple twitter requests might cause the rate to exceed so make an
  // approximation.
  if (data.followers_count > FOLLOWER_COUNT_OF_HIGH_PROFILE_USER) {
    return (data.followers_count * TWITTER_GLOBAL_AVERAGE_FOLLOWER_COUNT);
  }
  const listResponse = await T.get('followers/list', {
    user_id: screenName,
    count: 200,
  });

  const total = listResponse.data.users
    .map(user => user.followers_count)
    .reduce((acc, score) => acc + score, 0);

  return {
    screenName,
    total,
    verified: data.verified,
    followers: listResponse.data.users,
  };
};

const getTwitterScore = async (sceenName) => {
  const response = await getFollowersOfFollowers(sceenName);
  const { total } = response;
  const TGAFC = TWITTER_GLOBAL_AVERAGE_FOLLOWER_COUNT;
  const relativeScore = total / (TGAFC * TGAFC);
  const score = (relativeScore * 1000) / 2;
  const clippedScore = parseInt(Math.min(Math.max(0, score), 450), 10);
  return {
    ...response,
    impact: clippedScore,
  };
};

/**
 * Takes user `access_token` and `access_token_secret` and then
 * verifies them with twitter. Returns twitter screenName or undefined
 * @param {Object} userCredentials
 * @returns {Promise}
 */
const verifyCredentials = (userCredentials) => {
  // Combine app secret with client secret
  const twitterSecretCopy = {
    ...twitterSecret,
    ...userCredentials,
  };

  const T = new Twit(twitterSecretCopy);

  return T.get('account/verify_credentials', { skip_status: true })
    .then(result => (result.data.screen_name))
    .catch(err => (err));
};

/**
 * Takes a twitter screenName and finds score from db
 * @param {String} screenName
 * @returns {Number} score
 */
const getScoreFromDb = async (screenName) => {
  try {
    const { userId } = await models.twitters.findOne({
      where: {
        id: screenName,
      },
    });
    const { socialScore } = await models.users.findOne({
      where: {
        id: userId,
      },
    });
    return socialScore;
  } catch (e) {
    return null;
  }
};

/**
 * Takes a twitter screenName and score and updates the db
 * @param {String} screenName
 * @param {Number} socialScore
 */
const saveScoreIntoDb = async (screenName, socialScore) => {
  const { userId } = await models.twitters.findOne({
    where: { id: screenName },
  });
  await models.users.update(
    {
      socialScore,
    },
    {
      where: {
        id: userId,
      },
    },
  );
};

/**
 * Checks if the account exists
 * @param {String} screenName
 * @returns {boolean}
 */
const doesAccountExist = async (screenName) => {
  const entry = await models.twitters.findOne({
    where: { id: screenName },
  });
  return entry !== null;
};

/**
 * Creates a new entry in twitters table
 * @param {String} id Twitter screenName
 * @param {Number} userId
 */
const insertEntry = (id, userId) =>
  models.twitters.upsert({ id, userId })
    .catch(() => { });

/**
 * Takes screenName of twitter and FB accesstoken and creates a new
 * entry in users
 * @param {String} screenName
 * @param {String} accesstoken
 */
const linkTwitter = async (screenName, accesstoken) => {
  const fbResponse = await inspectUserAccessToken(accesstoken);
  const fbEntry = await models.facebooks.findOne({
    where: { id: fbResponse.userId },
  });
  await insertEntry(screenName, fbEntry.userId);
};

module.exports = {
  getTwitterScore,
  verifyCredentials,
  getScoreFromDb,
  saveScoreIntoDb,
  doesAccountExist,
  insertEntry,
  linkTwitter,
  getFollowersOfFollowers,
  getFollowersList,
  showData,
};

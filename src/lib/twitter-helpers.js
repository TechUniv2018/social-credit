const Twit = require('twit');

const twitterSecret = require('./twitter-config');

const TWITTER_GLOBAL_AVERAGE_FOLLOWER_COUNT = 60;
const FOLLOWER_COUNT_OF_HIGH_PROFILE_USER = 5000;

/**
 * Takes a twitter screen_name and returns the number of followers of
 * followers. Makes an estimate if number of followers is greater than 5000.
 * @param {string} screenName Screen name of the twitter user
 * @param {function} callback Callback function
 * @returns {number} returns the number of followers of followers or error
 */
const getFollowersOfFollowers = (screenName, callback) => {
  // Only public data is used to auth is not needed
  const twitterSecretCopy = {
    ...twitterSecret,
    app_only_auth: true,
  };

  const T = new Twit(twitterSecretCopy);
  // Queries twitter for basic user info
  T.get('users/show', { screen_name: screenName }, (err1, data) => {
    if (err1) callback(err1);

    // If the number of followers is greater than 5000 then a single
    // twitter request would not be sufficient to count the number of followers
    // Multiple twitter requests might cause the rate to exceed so make an
    // approximation.
    if (data.followers_count > FOLLOWER_COUNT_OF_HIGH_PROFILE_USER) {
      callback(data.followers_count * TWITTER_GLOBAL_AVERAGE_FOLLOWER_COUNT);
    } else {
      T.get('followers/list', { screen_name: screenName }, (err2, followersData) => {
        if (err2) callback(err2);
        const totalScore = followersData.users
          .map(user => user.followers_count)
          .reduce((acc, score) => acc + score, 0);
        callback(totalScore);
      });
    }
  });
};

const getTwitterScore = (sceenName, callback) => {
  getFollowersOfFollowers(sceenName, (res) => {
    if (typeof res === 'number') {
      const TGAFC = TWITTER_GLOBAL_AVERAGE_FOLLOWER_COUNT;
      const relativeScore = res / (TGAFC * TGAFC);
      const score = (relativeScore * 100) / 2;
      const clippedScore = Math.min(Math.max(0, score), 100);
      callback(clippedScore);
    } else {
      callback(res);
    }
  });
};

const verifyCredentials = (userCredentials, callback) => {
  // Combine app secret with client secret
  const twitterSecretCopy = {
    ...twitterSecret,
    ...userCredentials,
  };

  const T = new Twit(twitterSecretCopy);

  return T.get('account/verify_credentials', { skip_status: true })
    .catch((err) => {
      callback(err);
    })
    .then((result) => {
      callback(result.data.screen_name);
    });
};

module.exports = {
  getTwitterScore,
  verifyCredentials,
};

const joi = require('joi');

const {
  inspectUserAccessToken,
  findUserInFacebooksTable,
  getFacebookUserData,
} = require('../../../../src/lib/facebook-helpers');

const {
  getTwitterScore,
} = require('../../../../src/lib/twitter-helpers');

const {
  fetchDataFromUserTable,
} = require('../../../../src/lib/user-helpers');

const models = require('../../../../models');

const { maximumEligibleAmount } = require('../../../lib/loan-helpers');

const getTwitterData = async (userId) => {
  const twitterTableRow = await models.twitters.findOne({ where: { userId } });
  if (twitterTableRow === null) {
    return {
      total: 0,
      verified: false,
      secondFollowersCount: 0,
      followersCount: 0,
      impact: 0,
      followers: [],
    };
  }
  const screenName = twitterTableRow.id;
  const fof = await getTwitterScore(screenName);
  return fof;
};

const handleRequest = async (accesstoken) => {
  // Ask FB about the validity of the header
  const inspectResult = await inspectUserAccessToken(accesstoken);
  if (inspectResult.isValid) {
    const fbData = await getFacebookUserData(accesstoken);
    const user = { id: inspectResult.userId };
    const facebookTableRow = await findUserInFacebooksTable(user);
    const userTableRow = await fetchDataFromUserTable(facebookTableRow.userId);
    const twitterData = await getTwitterData(userTableRow.id);

    // Round social score and update it
    const facebookImpact = parseInt(Math.min(fbData.numberOfFriends / 5, 500), 10);
    const twitterImpact = parseInt(Math.min(twitterData.impact, 500), 10);

    const newSocialScore = facebookImpact + twitterImpact;
    await models.users.update(
      { socialScore: newSocialScore },
      { where: { id: userTableRow.id } },
    );

    // Calculate new max amount
    const maxAmount = maximumEligibleAmount(newSocialScore);

    const data = {
      data: {
        firstName: userTableRow.firstName,
        lastName: userTableRow.lastName,
        socialScore: newSocialScore,
        breakDown: {
          facebook: {
            friendsCount: fbData.numberOfFriends,
            impact: facebookImpact,
          },
          twitter: {
            isVerified: false,
            secondFollowersCount: twitterData.total,
            followersCount: twitterData.followers.length,
            impact: twitterImpact,
          },
        },
        maxAmount,
      },
      statusCode: 200,
    };
    return data;
  }
  return {
    statusCode: 401,
    data: {
      message: 'Invalid user access token',
    },
  };
};

module.exports = [
  {
    path: '/api/users/info',
    method: 'GET',
    config: {
      validate: {
        headers: {
          accesstoken: joi.string().required(),
        },
        options: {
          allowUnknown: true,
        },
      },
      description: 'Checks user token and sends user information. Fails with 401 if token is invalid.',
      tags: ['api', 'users'],
    },
    handler: (request, response) => {
      // Get FB accesstoken from headers
      const { accesstoken } = request.headers;
      handleRequest(accesstoken)
        .then(response)
        .catch(response);
    },
  },
];

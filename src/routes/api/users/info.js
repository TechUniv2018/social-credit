const joi = require('joi');

const facebookHelpers = require('../../../../src/lib/facebook-helpers');
const authHelpers = require('../../../lib/auth-helpers');

const {
  getTwitterScore,
} = require('../../../../src/lib/twitter-helpers');

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
  const inspectResult = await authHelpers.decodeJwtToken(accesstoken);
  if (inspectResult.userId) {
    // Load user and all providers
    const user = await models.users.findOne({
      where: { id: inspectResult.userId },
      include: [
        {
          model: models.facebooks,
          as: 'facebook',
        },
      ],
    });

    const fbData = await facebookHelpers.userProfile(user.facebook.id);

    const twitterData = await getTwitterData(user.id);

    // Round social score and update it
    const facebookImpact = parseInt(Math.min(fbData.friends.summary.total_count / 5, 450), 10);
    const twitterImpact = twitterData.impact;

    const newSocialScore = facebookImpact + twitterImpact;
    await user.updateAttributes({ socialScore: newSocialScore });

    // Calculate new max amount
    const maxAmount = maximumEligibleAmount(newSocialScore);
    const twitterTableRow = await models.twitters.findOne({ where: { userId: userTableRow.id } });

    const data = {
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        socialScore: newSocialScore,
        breakDown: {
          facebook: {
            friendsCount: fbData.friends.summary.total_count,
            impact: facebookImpact,
          },
          twitter: {
            isVerified: false,
            screenName: twitterTableRow ? twitterTableRow.id : '',
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
          access_token: joi.string().required(),
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
      const accessToken = request.headers.access_token;
      handleRequest(accessToken)
        .then(response)
        .catch(response);
    },
  },
];

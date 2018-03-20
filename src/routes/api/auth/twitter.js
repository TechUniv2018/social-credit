const joi = require('joi');

const models = require('../../../../models');
const { inspectUserAccessToken } = require('../../../lib/facebook-helpers');

module.exports = [
  {
    path: '/api/auth/twitter',
    method: 'GET',
    config: {
      validate: {
        query: {
          redirect: joi.string().uri(),
        },
        options: {
          allowUnknown: true,
        },
      },
      auth: 'twitter',
      handler: async (request, response) => {
        // Save twitter user to db
        const { accessToken } = request.state['bell-twitter'].query;

        const userValidity = await inspectUserAccessToken(accessToken);

        if (userValidity.isValid) {
          const usersFacebookData = await models.facebooks.findOne({
            where: {
              id: userValidity.userId,
            },
          });

          await models.twitters.newTwitter(
            usersFacebookData.userId,
            request.auth.credentials.profile.username,
          );

          response.redirect('http://localhost:3000');
        } else {
          response({
            error: 'Invalid token',
            message: 'Invalid user access token',
            statusCode: 400,
          });
        }
      },
    },
  },
];

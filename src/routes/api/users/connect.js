const joi = require('joi');

const models = require('../../../../models');
const authHelpers = require('../../../lib/auth-helpers');

module.exports = [
  {
    path: '/api/users/connect',
    method: 'POST',
    config: {
      description: 'Connect a social media provider.',
      tags: ['api', 'users'],
      validate: {
        headers: {
          access_token: joi.string().required(),
        },
        payload: {
          providerAccessToken: joi.string().required(),
        },
        options: {
          allowUnknown: true,
        },
      },
    },
    handler: async (request, response) => {
      const inspectionResult = authHelpers.decodeJwtToken(request.headers.access_token);

      if (inspectionResult.userId) {
        const userData = await authHelpers.inspectAccessToken(
          authHelpers.connectionsAuth,
          request.payload.providerAccessToken,
        );

        const [providerName, providerId] = userData.sub.split('|');
        const providerTable = `${providerName}s`;

        // Create the row for the provider
        await models[providerTable].findOrCreate({
          where: {
            id: providerId,
            userId: inspectionResult.userId,
          },
        });

        return response({
          statusCode: 200,
        });
      }

      return response({
        error: 'Invalid token',
        message: 'Invalid user access token',
        statusCode: 400,
      });
    },
  },
];

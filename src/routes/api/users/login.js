const joi = require('joi');

const models = require('../../../../models');
const authHelpers = require('../../../lib/auth-helpers');

const signUpClient = authHelpers.auth0generator(process.env.AUTH0_CLIENT_ID);

module.exports = [
  {
    path: '/api/users/login',
    method: 'POST',
    config: {
      description: 'Checks if the userId is valid. If valid, api checks if the user has already present in database and sends 200 statusCode. If not, then the api will populate the database and login the user and returns success. If not valid, send 401 statusCode',
      tags: ['api', 'users'],
      validate: {
        headers: {
          access_token: joi.string().required(),
        },
        options: {
          allowUnknown: true,
        },
      },
    },
    handler: async (request, response) => {
      try {
        const accesstoken = request.headers.access_token;

        const data = await authHelpers.inspectAccessToken(signUpClient, accesstoken);
        const [providerName, providerId] = data.sub.split('|');
        const providerTable = `${providerName}s`;

        const socialUserData = await models[providerTable].findOne({
          where: { id: providerId },
          include: [
            {
              model: models.users,
              as: 'user',
            },
          ],
        });
        let userId = socialUserData ? socialUserData.user.id : undefined;

        if (!socialUserData) {
          // New signup
          const user = await models.users.create({
            firstName: data.given_name,
            lastName: data.family_name,
            socialScore: 0,
          });

          // Create the row for the provider
          await models[providerTable].create({
            id: providerId,
            userId: user.id,
          });

          userId = user.id;
        }

        response({
          statusCode: 200,
          apiToken: authHelpers.signJwtToken(userId),
        });
      } catch (error) {
        response({
          statusCode: 500,
          error: 'Internal Server Error',
          message: 'Something went wrong...',
        });
      }
    },
  },
];

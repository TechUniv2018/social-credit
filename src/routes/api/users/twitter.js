const joi = require('joi');

const {
  getTwitterScore,
  verifyCredentials,
} = require('../../../../src/lib/twitter-helpers');

module.exports = [
  {
    path: '/api/users/twitter',
    method: 'POST',
    config: {
      description: 'Checks if the access token is valid and calculates twitter score',
      tags: ['api'],
      validate: {
        headers: {
          access_token: joi.string().required(),
          access_token_secret: joi.string().required(),
        },
        options: {
          allowUnknown: true,
        },
      },
    },
    handler: (request, response) => {
      verifyCredentials(
        request.headers,
        (screenName) => {
          if (screenName) {
            getTwitterScore(
              screenName,
              (score) => {
                response({
                  screenName,
                  score,
                  statusCode: 200,
                });
              },
            );
          } else {
            response({
              screenName: '',
              statusCode: 401,
            });
          }
        },
      );
    },
  },
];

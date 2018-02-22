const joi = require('joi');

const {
  inspectUserAccessToken,
  getFacebookUserData,
  findUserInFacebooksTable,
} = require('../../../../src/lib/facebook-helpers');

const {
  fetchDataFromUserTable,
} = require('../../../../src/lib/user-helpers');

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
      tags: ['api'],
    },
    handler: (request, response) => {
      // Get FB accesstoken from headers
      const { accesstoken } = request.headers;

      // Ask FB about the validity of the header
      inspectUserAccessToken(accesstoken)
        .then((inspectResult) => {
          if (inspectResult.isValid) {
            return getFacebookUserData(accesstoken) // Get the user data from FB
              .then(findUserInFacebooksTable) // Find corresponding user id
              .then(userData => userData.userId) // Extract out FB id
              .then(fetchDataFromUserTable) // Fetch all user data
              .then(userData => Promise.resolve({
                firstName: userData.firstName,
                lastName: userData.lastName,
                socialScore: userData.socialScore,
                maxLoanAmount: 0, // TODO
              }));
          }
          return Promise.resolve({
            statusCode: 401,
            message: 'Invalid user access token',
          });
        })
        .then(response)
        .catch(response);
    },
  },
];

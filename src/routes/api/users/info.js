const joi = require('joi');

const {
  inspectUserAccessToken,
  findUserInFacebooksTable,
  getFacebookUserData,
} = require('../../../../src/lib/facebook-helpers');

const {
  fetchDataFromUserTable,
} = require('../../../../src/lib/user-helpers');

const handleRequest = async (accesstoken) => {
  // Ask FB about the validity of the header
  const inspectResult = await inspectUserAccessToken(accesstoken);
  if (inspectResult.isValid) {
    const fbData = await getFacebookUserData(accesstoken);
    const user = { id: inspectResult.userId };
    const facebookTableRow = await findUserInFacebooksTable(user);
    const userTableRow = await fetchDataFromUserTable(facebookTableRow.userId);
    const data = {
      data: {
        firstName: userTableRow.firstName,
        lastName: userTableRow.lastName,
        socialScore: userTableRow.socialScore,
        fbFriends: fbData.numberOfFriends,
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
      tags: ['api'],
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

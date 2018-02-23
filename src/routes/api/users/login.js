const joi = require('joi');

const {
  inspectUserAccessToken,
  getFacebookUserData,
  createUserInFacebooksTable,
  findUserInFacebooksTable,
} = require('../../../../src/lib/facebook-helpers');

const { addUser } = require('../../../../src/lib/user-helpers');

const handleNewUser = (facebookUser) => {
  const socialScore = facebookUser.numberOfFriends / 50;
  return addUser(facebookUser, socialScore)
    .then((user) => { createUserInFacebooksTable(facebookUser, user); });
};

const findOrCreateUser = (facebookEntry, facebookUser) => {
  if (facebookEntry !== null) {
    return Promise.resolve({
      success: true,
      statusCode: 200,
    });
  }
  return handleNewUser(facebookUser)
    .then(() =>
      Promise.resolve({
        success: true,
        statusCode: 200,
      }));
};

module.exports = [
  {
    path: '/api/users/login',
    method: 'POST',
    config: {
      description: 'Checks if the userId is valid. If valid, api checks if the user has already present in database and sends 200 statusCode. If not, then the api will populate the database and login the user and returns success. If not valid, send 401 statusCode',
      tags: ['api'],
      validate: {
        headers: {
          accesstoken: joi.string().required(),
        },
        options: {
          allowUnknown: true,
        },
      },
    },
    handler: (request, response) => {
      const { accesstoken } = request.headers;
      inspectUserAccessToken(accesstoken)
        .then((isUserValid) => {
          if (isUserValid.isValid) {
            let userData;
            return getFacebookUserData(accesstoken)
              .then((facebookUser) => {
                userData = facebookUser;
                return findUserInFacebooksTable(facebookUser);
              })
              .then(facebookEntry => findOrCreateUser(facebookEntry, userData));
          }
          return Promise.resolve({
            success: false,
            statusCode: 401,
          });
        })
        .then(response)
        .catch(response);
    },
  },
];

const { inspectUserAccessToken,
  getFacebookUserData,
  createUserInFacebooksTable,
  findUserInFacebooksTable }
  = require('../../../../src/lib/facebook-helpers');

const model = require('../../../../models');

const { addUser } = require('../../../../src/lib/user-helpers')

const handleNewUser = (facebookUser) => {
  const socialScore = facebookUser.numberOfFriends / 50;
  return addUser(facebookUser, socialScore)
    .then(createUserInFacebookTable)
}

const findOrCreateUser = (facebookEntry, facebookUser) => {
  if (facebookEntry !== null) {
    return Promise.resolve({
      success: true,
      statusCode: 200,
    });
  } else {
    return handleNewUser(facebookUser)
      .then(() =>
        Promise.resolve({
          success: true,
          statusCode: 200,
        }));
  }
}

module.exports = [
  {
    path: '/api/users/login',
    method: 'POST',
    config: {
      description: 'Checks if the userId is valid. If valid, api checks if the user has already present in database and sends 200 statusCode. If not, then the api will populate the database and login the user and returns success. If not valid, send 401 statusCode',
      tags: ['api'],
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
              .then((facebookEntry) => {
                return findOrCreateUser(facebookEntry, userData);
              });
          } else {
            return Promise.resolve({
              success: false,
              statusCode: 401,
            });
          }
        })
        .then(response)
      // .catch(err => response(err));
    },
  },
];

const { inspectUserAccessToken, getFacebookUserData } = require('../../../../src/lib/facebook-helpers');
const model = require('../../../../models');


module.exports = [
  {
    path: '/api/users/login',
    method: 'GET',
    handler: (request, response) => {
      const { accesstoken } = request.headers;
      inspectUserAccessToken(accesstoken)
        .then((isUserValid) => {
          if (isUserValid.isValid) {
            getFacebookUserData(accesstoken)
              .then(userData => model.facebook.findOne({
                where: {
                  id: userData.id,
                },
              })
                .then((facebookEntry) => {
                  if (facebookEntry !== null) {
                    response({
                      success: true,
                      statusCode: 200,
                    });
                  } else {
                    const socialScore = userData.numberOfFriends / 50;
                    // const maxLoanAmount = socialScore * 100;
                    model.user.create({
                      where: {
                        firstName: userData.firstName,
                        lastName: userData.lastName,
                        socialScore,
                      },
                    }).then((user) => {
                      model.facebook.create({
                        id: userData.id,
                        userId: user.id,
                      }).then(() =>
                        response({
                          success: true,
                          statusCode: 201,
                        }));
                    });
                  }
                }));
          } else {
            response({
              success: false,
              statusCode: 401,
            });
          }
        });
    },

  },
];

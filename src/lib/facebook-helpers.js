const rp = require('request-promise');
const facebookUrls = require('../../constants/facebook');
const model = require('../../models');

/**
 * This function reads the CLIENT_ID and CLIENT_SECRET environment variables
 * to use environment variables, type
 * `CLIENT_ID={your-client-id} CLIENT_SECRET={your-client-secret} npm start`
 * in shell
 */
const getAppAccessToken = () => {
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const requestUrl = `${facebookUrls.getAccessToken}&client_id=${clientId}&client_secret=${clientSecret}`;
  return rp(requestUrl)
    .then(response => JSON.parse(response).access_token);
};

/**
 * This helper function takes the user access token and checks whether it is valid or not.
 * This is done using facebook debug_token route in the Graph API.
 * @param {string} accessToken
 */
const inspectUserAccessToken = accessToken => new Promise((resolve) => {
  const notValidResult = {
    isValid: false,
  };

  getAppAccessToken()
    .then((appAccessToken) => {
      const requestUrl = `${facebookUrls.debugToken}?input_token=${accessToken}&access_token=${appAccessToken}`;
      return rp.get(requestUrl);
    })
    .then((response) => {
      const responseData = JSON.parse(response);

      if (responseData.data.is_valid) {
        resolve({
          isValid: true,
          userId: responseData.data.user_id,
        });
      } else {
        resolve(notValidResult);
      }
    })
    .catch(() => resolve(notValidResult));
});

/**
 * This helper function retrieves the facebook user data.
 * @param {string} accessToken
 */
const getFacebookUserData = accessToken => new Promise((resolve, reject) => {
  const requestUrl = `${facebookUrls.userData}&access_token=${accessToken}`;
  const error = new Error('Unable to retrieve facebook user data');
  rp.get(requestUrl)
    .then((response) => {
      if (response.error) {
        reject(error);
      }
      const parsedData = JSON.parse(response);
      resolve({
        id: parsedData.id,
        firstName: parsedData.first_name,
        lastName: parsedData.last_name,
        numberOfFriends: parsedData.friends.summary.total_count,
      });
    })
    .catch(() => {
      reject(error);
    });
});

const createUserInFacebooksTable = (user) => {
  return model.facebooks.create({
    id: facebookUser.id,
    userId: user.id,
  });
}

const findUserInFacebooksTable = (facebookUser) => {
  return model.facebooks.findOne({
    where: {
      id: facebookUser.id,
    },
  });
}

module.exports = {
  getAppAccessToken,
  inspectUserAccessToken,
  getFacebookUserData,
  createUserInFacebooksTable,
  findUserInFacebooksTable,
};

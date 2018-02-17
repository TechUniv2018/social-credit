const rp = require('request-promise');
const facebookUrls = require('../../constants/facebook');

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

module.exports = getAppAccessToken;

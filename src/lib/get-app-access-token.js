const rp = require('request-promise');

/**
 * This function reads the CLIENT_ID and CLIENT_SECRET environment variables
 * to use environment variables, type
 * `CLIENT_ID={your-client-id} CLIENT_SECRET={your-client-secret} npm start`
 * in shell
 */
const getAppAccessToken = () => {
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const requestUrl = `https://graph.facebook.com/oauth/access_token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`;
  return rp(requestUrl)
    .then(response => JSON.parse(response).access_token);
};

module.exports = getAppAccessToken;

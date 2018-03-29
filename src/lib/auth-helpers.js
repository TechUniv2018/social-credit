const jsonWebToken = require('jsonwebtoken');
const auth0 = require('auth0-js');

const auth0generator = clientId => new auth0.Authentication({
  domain: 'sauravsahu.auth0.com',
  clientID: clientId,
  audience: 'https://sauravsahu.auth0.com/userinfo',
  responseType: 'token id_token',
  scope: 'openid profile email',
});

const signUpAuth = auth0generator(process.env.AUTH0_CLIENT_ID);
const connectionsAuth = auth0generator(process.env.AUTH0_CONNECTIONS_CLIENT_ID);

const inspectAccessToken = (auth0Client, accessToken) => new Promise((resolve, reject) => {
  auth0Client.userInfo(accessToken, (err, data) => {
    if (err) resolve({ isValid: false });
    else {
      resolve({
        isValid: true,
        ...data,
      });
    }
  });
});

const signJwtToken = userId => jsonWebToken.sign(
  { userId },
  process.env.JWT_PASSWORD,
);

const decodeJwtToken = token => jsonWebToken.verify(token, process.env.JWT_PASSWORD);

module.exports = {
  signUpAuth,
  connectionsAuth,
  decodeJwtToken,
  signJwtToken,
  inspectAccessToken,
};

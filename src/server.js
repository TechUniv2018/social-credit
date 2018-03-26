/**
 * The index.js file aggregates the routing logic and starts the server
 */
const hapi = require('hapi');
const bell = require('bell');
const inert = require('inert');
const vision = require('vision');
const hapiSwagger = require('hapi-swagger');
const hapiAuthJwt2 = require('hapi-auth-jwt2');

const routes = require('./routes');

// Create a new Hapi server
const server = new hapi.Server({
  connections: {
    routes: {
      cors: true,
    },
  },
});

server.connection({
  port: Number(process.env.PORT || 8080),
  host: '0.0.0.0',
});

/**
 * Register hapi-swagger
 */
server.register([
  bell,
  hapiAuthJwt2,
  inert,
  vision,
  {
    register: hapiSwagger,
    options: {
      info: {
        title: 'Social Credit API Documentation',
        version: '0.0.0',
      },
      grouping: 'tags',
    },
  },

]);

const twitterConstants = require('./lib/twitter-config');

server.auth.strategy(
  'jwt',
  'jwt',
  {
    key: '1234567890okjnbvcdrtyujhvcxdse4567ujhfrty', // Never Share your secret key
    validateFunc: () => ({ isValid: true }), // validate function defined above
    verifyOptions: { algorithms: ['HS256'] }, // pick a strong algorithm
  },
);

server.auth.strategy('twitter', 'bell', {
  provider: 'twitter',
  password: '1234567890qwertyuiopzxcvbnmasdfghjkl', // TODO: Use env variable in production
  clientId: twitterConstants.consumer_key,
  clientSecret: twitterConstants.consumer_secret,
  isSecure: false,
});

server.auth.strategy('facebook', 'bell', {
  provider: 'facebook',
  password: 'cookie_encryption_password_secure',
  isSecure: false,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  // location: server.info.uri,
});

server.route(routes);

/**
 * Start the server
 */
if (!module.parent) {
  server.start((err) => {
    if (err) {
      throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);
  });
}

module.exports = server;

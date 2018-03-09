/**
 * The index.js file aggregates the routing logic and starts the server
 */
const hapi = require('hapi');
const inert = require('inert');
const vision = require('vision');
const hapiSwagger = require('hapi-swagger');

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

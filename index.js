/**
 * The index.js file aggregrates the routing logic and starts the server
 */
const Hapi = require('hapi');

// Create a new Hapi server
const server = new Hapi.Server();
server.connection({ port: 8080, host: 'localhost' });

/**
 * Host the public folder statically
 */
server.register(require('inert'), (err) => {
  if (err) {
    throw err;
  }

  server.route({
    method: 'GET',
    path: '/{file*}',
    handler: {
      directory: {
        path: './public/',
      },
    },
  });
});

/**
 * Start the server
 */
server.start((err) => {
  if (err) {
    throw err;
  }
  console.log(`Server running at: ${server.info.uri}`);
});

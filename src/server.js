/**
 * The index.js file aggregates the routing logic and starts the server
 */
const hapi = require('hapi');
const inert = require('inert');
const routes = require('./routes');

// Create a new Hapi server
const server = new hapi.Server();
server.connection({
  port: Number(process.env.PORT || 8080),
  host: 'localhost',
});

/**
 * Host the public folder statically
 */
server.register(inert, (err) => {
  if (err) {
    throw err;
  }

  server.route({
    method: 'GET',
    path: '/{file*}',
    handler: {
      directory: {
        path: 'public/',
      },
    },
  });
});

server.route({
  method: 'GET',
  path: '/admin',
  handler: (request, response) => {
    const dummyJson = [
      { first_name: 'fn1', last_name: 'ln1' },
      { first_name: 'fn2', last_name: 'ln2' },
    ];
    response(JSON.stringify(dummyJson))
      .header('Content-Type', 'application/json');
  },
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

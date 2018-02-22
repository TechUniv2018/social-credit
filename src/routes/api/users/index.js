const loans = require('./loans');
const login = require('./login');
const info = require('./info');

module.exports = [].concat(
  loans,
  login,
  info,
);

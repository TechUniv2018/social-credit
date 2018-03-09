const loans = require('./loans');
const login = require('./login');
const info = require('./info');
const emi = require('./emi');

module.exports = [].concat(
  loans,
  login,
  info,
  emi,
);

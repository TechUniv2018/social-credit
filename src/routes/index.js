const banks = require('./api/max-amount.js');
const users = require('./api/users');

module.exports = [].concat(banks, users);

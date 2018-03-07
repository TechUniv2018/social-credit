const banks = require('./api/max-amount.js');
const users = require('./api/users');
const admin = require('./api/admin/loans');

module.exports = [].concat(banks, users, admin);

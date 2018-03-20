const banks = require('./api/max-amount.js');
const users = require('./api/users');
const admin = require('./api/admin/');
const auth = require('./api/auth');

module.exports = [].concat(banks, users, admin, auth);

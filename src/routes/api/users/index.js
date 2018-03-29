const loans = require('./loans');
const login = require('./login');
const info = require('./info');
const emi = require('./emi');
const twitter = require('./twitter');
const twitterGraph = require('./twitterGraph');
const connect = require('./connect');

module.exports = [].concat(
  loans,
  login,
  info,
  emi,
  twitter,
  twitterGraph,
  connect,
);

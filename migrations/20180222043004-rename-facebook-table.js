module.exports = {
  up: queryInterface => queryInterface.renameTable('facebook', 'facebooks'),
  down: queryInterface => queryInterface.renameTable('facebooks', 'facebook'),
};

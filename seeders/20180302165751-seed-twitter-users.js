module.exports = {
  up: queryInterface => queryInterface.bulkInsert('twitters', [
    {
      id: 'SouradeepNanda',
      userId: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]),
  down: queryInterface => queryInterface.bulkDelete('twitters'),
};

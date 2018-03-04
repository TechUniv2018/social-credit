module.exports = {
  up: queryInterface => queryInterface.bulkInsert('facebooks', [
    {
      id: '1805116396205254',
      userId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '1623984961019175',
      userId: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2051629538452614',
      userId: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]),
  down: queryInterface => queryInterface.bulkDelete('facebooks'),
};

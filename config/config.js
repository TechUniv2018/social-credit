module.exports = {
  development: {
    username: 'database_admin',
    password: 'password',
    database: 'socialscore_dev',
    host: '127.0.0.1',
    dialect: 'postgres',
  },
  test: {
    username: 'database_admin',
    password: 'password',
    database: 'socialscore_test',
    host: '127.0.0.1',
    dialect: 'postgres',
  },
  production: {
    username: process.env.POSTGRES_USER_NAME,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB_NAME,
    host: process.env.POSTGRES_HOST,
    dialect: 'postgres',
  },
};

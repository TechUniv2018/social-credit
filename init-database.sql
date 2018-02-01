CREATE ROLE database_admin WITH LOGIN PASSWORD 'password';
ALTER ROLE database_admin CREATEDB;
CREATE DATABASE socialscore_dev;
GRANT ALL PRIVILEGES ON DATABASE socialscore_dev TO database_admin;

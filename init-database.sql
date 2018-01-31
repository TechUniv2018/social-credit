CREATE ROLE customer WITH LOGIN PASSWORD 'password';
ALTER ROLE customer CREATEDB;
CREATE DATABASE awesomesocialcredit;
GRANT ALL PRIVILEGES ON DATABASE awesomesocialcredit TO customer;

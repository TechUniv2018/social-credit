#!/bin/sh

node_modules/.bin/sequelize init && \
cat scripts/json/config.json > config/config.json && \
node_modules/.bin/sequelize model:generate --name User --attributes firstName:string,lastName:string,email:string && \
node_modules/.bin/sequelize db:migrate

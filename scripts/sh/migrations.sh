#!/bin/sh

node_modules/.bin/sequelize init && \
node_modules/.bin/sequelize model:generate --name User --attributes firstName:string,lastName:string,email:string && \
node_modules/.bin/sequelize db:migrate

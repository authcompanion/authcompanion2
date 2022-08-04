# syntax=docker/dockerfile:1
FROM node:current-alpine3.15 AS build

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY ["package.json", "package-lock.json*", "./"]

RUN npm install

# Bundle app source and build
COPY . .
RUN npm run docs:build

# Setup Caddy
FROM caddy:2.4.6-alpine

COPY --from=build /usr/src/app/docs/.vuepress/dist /usr/share/caddy/
COPY ./Caddyfile /etc/caddy/Caddyfile
#COPY ./downloads /usr/share/caddy/downloads

EXPOSE 80
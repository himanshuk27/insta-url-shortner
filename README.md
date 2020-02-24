# Insta url shortner

## App Features

- Instant short link generator
- Set custom link
- Set expiry date and time
- Link analytics (work in progress)

## App Technology Features

- VueJs based frontend
- Express nodejs backend
- Mongodb database
- jest unit test
- cypress e2e test
- Vuex store with encrypted local storage
- JWT Auth token, super secure version using public and private key
- Babel support for latest syntax
- eslint for clean code
- Secure password storage with bcrypt
- Redis Cache
- Redis Rate Limiter
- Xss protection, frameguard for click jacking, ddos protection etc (helmet)
- Unique secure uuids, harder to guess
- Docker container build files (work in progress)

## Installation Requirements

- Install Redis server
  > sudo apt install redis-server
- Npm install
  > npm install

## Build Commands

- Run development frontend server
  > npm run dev
- Run development backend server
  > npm run dev-server
- Run prod backend server
  > npm run build-server &&
  > node lib/server.js
- Run prod fronted server
  > npm run build &&
  > http-server dist
- Run unit test
  > npm run test:unit
- Run end to end test
  > npm run test:e2e

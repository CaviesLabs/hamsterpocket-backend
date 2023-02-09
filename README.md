<p align="center">
  <a style="background: black; display: block; border-radius: 8px; padding: 4px" href="http://id.ancient8.gg/" target="blank"><img src="https://cavies.xyz/assets/images/older-hamster.png" width="320" alt="Nest Logo" /></a>
</p>


## Description

**Hamsterbox Passport** repository.

## Installation

```bash
$ npm install
```

## Start Keycloak service

```bash
cd keycloak/

docker compose up -d
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
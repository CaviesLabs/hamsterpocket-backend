# Beersup Backend
## Description



## Installation

1. Make sure you have Docker and Docker Compose installed.

```bash
yarn install
```

## Setup environment

1. Create `.env` following `.env.example`
2. Create `config.json` following `example.config.json` file for deserved environment. Located at: `/deployments/local/`, `/deployments/<env>/`,...

## Running the app

```bash
# Deploy local by Docker Compose
./deployment/local/run.bash

# Shutdown the local deployment
./deployment/local/run.bash -d
# or
./deployment/local/run.bash --delete

# Restart a service
./deployment/local/run.bash -s backend
```


## Execute BDD tests

```bash
# Run all BDD test
./developments/bdd_test.bash

# Run single feature
./developments/bdd_test.bash features/solana_login.feature
```

## Support

Beersup is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please contact me ;)

## Stay in touch

- Author - [Richard](https://twitter.com/richard_ptit)

## License

Beersup is [MIT licensed](LICENSE).

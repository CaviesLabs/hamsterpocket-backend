yarn build

CONFIG_FILE="./e2e-test.config.json"

npx nyc --reporter=lcov --reporter=text --reporter=clover --reporter=text-summary mocha --require ts-node/register test/unit/test-entrypoint.spec.ts
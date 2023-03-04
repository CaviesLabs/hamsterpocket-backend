export CONFIG_FILE="./e2e-test.config.json"

yarn build

npx nyc --reporter=lcov --reporter=text --reporter=clover --reporter=text-summary mocha --timeout 10000 --require ts-node/register test/unit/test-entrypoint.spec.ts
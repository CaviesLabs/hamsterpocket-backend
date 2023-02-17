yarn build

CONFIG_FILE="./e2e-test.config.json"

case "$1" in
  -d | --dev)
    npx mocha --reporter=spec --full-trace --require ts-node/register test/e2e/test-entrypoint.e2e-spec.ts
  shift 1
  ;;
  -c | --ci)
    npx nyc --reporter=lcov --reporter=text --reporter=clover --reporter=text-summary mocha --require ts-node/register test/e2e/test-entrypoint.e2e-spec.ts
  shift 1
esac


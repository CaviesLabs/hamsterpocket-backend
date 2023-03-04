export CONFIG_FILE="./e2e-test.config.json"

yarn build

case "$1" in
  -d | --dev)
    npx mocha --timeout 30000 --reporter=spec --full-trace --require ts-node/register test/e2e/test-entrypoint.e2e-spec.ts
  shift 1
  ;;
  -c | --ci)
    npx nyc --reporter=lcov --reporter=text --reporter=clover --reporter=text-summary mocha --timeout 30000 --require ts-node/register test/e2e/test-entrypoint.e2e-spec.ts
  shift 1
esac


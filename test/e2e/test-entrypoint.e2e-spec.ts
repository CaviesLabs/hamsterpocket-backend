import { TestHelper } from '../test.helper';

/**
 * @dev Construct helper.
 */
export const testHelper = new TestHelper();

/**
 * @dev Setup before hook.
 */
before(async function () {
  try {
    await testHelper.bootTestingApp();
  } catch (e) {
    console.log(e);
    throw e;
  }
});

/**
 * @dev Setup after hook.
 */
after(async () => {
  await testHelper.shutDownTestingApp();

  /**
   * @dev also send signal to stop the test.
   */
  process.exit(0);
});

/**
 * @dev Require other test here.
 */
require('./dummy/dummy.e2e-spec');
require('./pool/find-pool.e2e-spec');
require('./portfolio/portfolio.e2e-spec');

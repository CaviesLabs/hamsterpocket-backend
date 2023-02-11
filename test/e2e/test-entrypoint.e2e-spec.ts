import { TestHelper } from '../test.helper';

/**
 * @dev Construct helper.
 */
export const testHelper = new TestHelper();

/**
 * @dev Setup before hook.
 */
before(async () => {
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

afterEach(function () {
  if (this.currentTest.err) {
    console.error(this.currentTest.err);
  }
});

/**
 * @dev Require other test here.
 */
require('./dummy/dummy.e2e-spec');

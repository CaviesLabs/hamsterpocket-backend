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
require('./swap-program/swap-program.e2e-spec');
require('./auth/idp-auth.e2e-specs');
require('./swap/proposal.e2e-specs');
require('./user/profile.e2e-specs');

import { expect } from 'chai';

/**
 * @dev Setup before hook.
 */
before(async () => {
  console.log('before hook');
});

/**
 * @dev Setup after hook.
 */
after(async () => {
  /**
   * @dev also send signal to stop the test.
   */
  process.exit(0);
});

/**
 * @dev Require other test here.
 */
describe('main test', () => {
  it('1 equal 1', () => {
    expect(1).to.equal(1);
  });
});

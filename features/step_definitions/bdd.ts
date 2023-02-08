import { Before } from '@cucumber/cucumber';
import { State } from './state';

Before(function () {
  /**
   * New test state every scenario.
   */
  this.state = new State();
});

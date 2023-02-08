import { Given } from '@cucumber/cucumber';
import { Keypair } from '@solana/web3.js';

import { getState } from './state';

Given('a valid solana account', function () {
  const state = getState(this);
  state.solanaValidKeyPair = Keypair.generate();
});

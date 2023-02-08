import { Then } from '@cucumber/cucumber';
import { getState } from './state';

Then('systems returns status code {string}', async function (code: string) {
  const state = getState(this);
  console.log(JSON.stringify(state.response));
  if (state.response.status != +code) {
    const body = JSON.stringify(state.response.body, null, 2);
    throw new Error(`Unexpected status code. Want: ${code}, got: ${state.response.status}.\n` + body);
  }
});

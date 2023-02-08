import * as request from 'supertest';

export function getBeersupBEClient() {
  return request(process.env.BEERSUP_BE);
}

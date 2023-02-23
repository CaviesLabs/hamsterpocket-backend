import { expect } from 'chai';
import * as request from 'supertest';

import { testHelper } from '../test-entrypoint.e2e-spec';

export async function getBalanceSuccessFunc(this: any) {
  const app = testHelper.app;

  // Precondition 1: A valid wallet
  const { walletAddress } = testHelper.createSolanaKeyPair();
  const ownerAddress = walletAddress;

  // Precondition 2: Existing pools in DB, use mock API for dev
  const createMockPoolResp = await request(app.getHttpServer())
    .post(`/api/pool/mock/generate`)
    .query({ ownerAddress });
  expect(createMockPoolResp.status).to.equal(201);

  const baseTokenAddress = createMockPoolResp.body.baseTokenAddress;

  // Step 1: Call API with ownerAddress & baseTokenAddress
  const getBalanceResp = await request(app.getHttpServer()).get(
    `/api/portfolio/${ownerAddress}/base-token/${baseTokenAddress}`,
  );
  expect(getBalanceResp.status).to.equal(200);
  expect(getBalanceResp.body.totalPoolsBalance).to.be.a('number');
  expect(getBalanceResp.body.totalPoolsBalanceValue).to.be.a('number');
  expect(getBalanceResp.body.topTokens).to.be.an('array');
  expect(getBalanceResp.body.topTokens.length).to.greaterThan(0);
}

describe('Get portfolio balance', function () {
  it('Get balance success', getBalanceSuccessFunc);
});

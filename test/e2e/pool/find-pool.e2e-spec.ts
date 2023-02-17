import { expect } from 'chai';
import * as request from 'supertest';
import { CommonQueryDto } from '../../../src/api-docs/dto/common-query.dto';

import {
  FindPoolDto,
  FindPoolSortOption,
} from '../../../src/pool/dtos/find-pool.dto';
import { TestState } from '../state.suite';
import { testHelper } from '../test-entrypoint.e2e-spec';

export async function getAllPoolsFunc(this: Mocha.Context) {
  const app = testHelper.app;
  const state = TestState.get(this);

  // Precondition 1: A valid wallet
  state.keypair = testHelper.createSolanaKeyPair();
  const ownerAddress = state.keypair.walletAddress;

  // Precondition 2: Existing pools in DB, use mock API for dev
  const createMockPoolResp = await request(app.getHttpServer())
    .post(`/api/pool/mock/generate`)
    .send({ ownerAddress } as FindPoolDto);
  expect(createMockPoolResp.status).to.equal(201);

  // Step 1: Call get pools api
  const findPoolResp = await request(app.getHttpServer())
    .get(`/api/pool`)
    .query({
      limit: 20,
      offset: 0,
      search: '',
      ownerAddress,
      sortBy: FindPoolSortOption.DATE_START_DESC,
    } as CommonQueryDto & FindPoolDto);
  expect(findPoolResp.statusCode).to.equal(200);
  expect(Array.isArray(findPoolResp.body)).is.true;
}

describe('Find pool', function () {
  it('Get all pools', getAllPoolsFunc);
});

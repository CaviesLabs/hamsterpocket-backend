import { Keypair } from '@solana/web3.js';
import { Response } from 'supertest';

export class State {
  /** Common */
  accessToken: string;
  response: Response;

  /** auth challenge */
  authChallengeTarget: string;
  authChallengeId: number;

  /** Solana */
  solanaValidKeyPair: Keypair;
}

export function getState(context: any): State {
  return context.state;
}

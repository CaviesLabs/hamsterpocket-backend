export enum IdentityProvider {
  SOLANA = 'SOLANA',
}

export class IdentityMethodEntity {
  id: number;

  userId: number;

  provider: IdentityProvider;

  Identity: string;
}

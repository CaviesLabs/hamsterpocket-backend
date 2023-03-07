export const POOL_QUEUE = 'pool';

/**
 * Repeatable jobs queue configuration for executing buy token.
 */
export const BUY_TOKEN_PROCESS = 'buy-token';

export type BuyTokenJobData = {
  poolId: string;
};

export const SYNC_POCKETS = 'sync-pocket';

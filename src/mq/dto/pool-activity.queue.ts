export const POOL_ACTIVITY_QUEUE = 'pool-activity';

/**
 * Repeatable jobs queue configuration for executing buy token.
 */
export const SYNC_POOL_ACTIVITY = 'sync-pool-activity';

export type SyncPoolActivityJobData = {
  poolId: string;
};

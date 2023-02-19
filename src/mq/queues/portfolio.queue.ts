export const PORTFOLIO_QUEUE = 'pool';

/**
 * Queue configuration for update user's portfolio.
 */
export const UPDATE_USER_TOKEN_PROCESS = 'update-user-token';

export type UpdatePortfolioJobData = {
  ownerAddress: string;

  tokenAddress: string;
};

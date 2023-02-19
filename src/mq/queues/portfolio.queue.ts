export const PORTFOLIO_QUEUE = 'pool';

/**
 * Queue configuration for update user's portfolio.
 */
export const UPDATE_PORTFOLIO_PROCESS = 'update-portfolio';

export type UpdatePortfolioJobData = {
  ownerAddress: string;
};

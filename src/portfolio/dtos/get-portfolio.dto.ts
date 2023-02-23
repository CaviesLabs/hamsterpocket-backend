export class TopToken {
  symbol: string;

  percent: number;
}

export class PortfolioView {
  totalPoolsBalance: number;

  totalPoolsBalanceValue: number;

  topTokens: TopToken[];
}

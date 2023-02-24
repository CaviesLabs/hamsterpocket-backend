export class TopToken {
  symbol: string;

  percent: number;

  total: number;

  price: number;
}

export class PortfolioView {
  totalPoolsBalance: number;

  totalPoolsBalanceValue: number;

  topTokens: TopToken[];
}

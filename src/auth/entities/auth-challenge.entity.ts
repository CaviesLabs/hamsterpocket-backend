export const MEMO_TEXT = `Welcome to Beersup!

Approve to sign in.

This request will not trigger a blockchain transaction or cost any gas fees.

Your authentication status will reset after 24 hours.`;

export class AuthChallengeEntity {
  id: number;

  target: string;

  memo: typeof MEMO_TEXT;

  expiryDate: number | string | Date;

  isResolved: boolean;

  /**
   * Duration time that the auth challenge valid for.
   */
  durationDelta: number;
}

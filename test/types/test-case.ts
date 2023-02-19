export type TestCase<Req = any, Res = any> = {
  /** Name of test case */
  name: string;

  /** Can be params, body, query or all of its */
  req?: Req;

  /** Can be a valid response or function to validate */
  res?: Res | ((res: Res) => void);
};

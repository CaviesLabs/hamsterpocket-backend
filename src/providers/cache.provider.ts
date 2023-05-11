export enum CacheLevel {
  MEDIUM = 'CacheLevel::Medium',
  LOW = 'CacheLevel::LOW',
  HARD = 'CacheLevel::HARD',
  INSTANT = 'CacheLevel::INSTANT',
}

export class CacheStorage {
  private static cacheStorage: Record<
    string,
    { value: any; expiredAt: number }
  > = {};

  public static cachePolicy: { expiredAfter: Record<string, number> } = {
    expiredAfter: {
      [CacheLevel.HARD]: 7 * 24 * 60 * 60 * 1000, // cached for 7 days
      [CacheLevel.MEDIUM]: 12 * 60 * 60 * 1000, // cached for 4 hours
      [CacheLevel.LOW]: 1 * 60 * 60 * 1000, // cached for 1 hour
      [CacheLevel.INSTANT]: 1 * 60 * 1000, // cached for 1 minute
    },
  };

  static get(key: string, defaultValue = undefined): any {
    if (
      !CacheStorage.cacheStorage[key] ||
      CacheStorage.cacheStorage[key].expiredAt <= new Date().getTime()
    ) {
      return undefined;
    }

    return CacheStorage.cacheStorage[key].value || defaultValue;
  }

  static set(
    key: string,
    value: any,
    cacheLevel: CacheLevel = CacheLevel.HARD,
  ): void {
    if (!CacheStorage[key]) {
      CacheStorage.cacheStorage[key] = { value: '', expiredAt: 0 };
    }

    CacheStorage.cacheStorage[key].value = JSON.parse(JSON.stringify(value));
    CacheStorage.cacheStorage[key].expiredAt =
      new Date().getTime() + CacheStorage.cachePolicy.expiredAfter[cacheLevel];
  }
}

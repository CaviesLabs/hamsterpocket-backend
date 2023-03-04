import { RedisMemoryServer } from 'redis-memory-server';

let redis: RedisMemoryServer;

export const getRedisMemoryServerURI = async (): Promise<string> => {
  redis = new RedisMemoryServer();

  return `redis://${await redis.getHost()}:${await redis.getPort()}`;
};

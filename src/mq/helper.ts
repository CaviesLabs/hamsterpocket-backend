import { RedisMemoryServer } from 'redis-memory-server';

let redis: RedisMemoryServer;

export const getRedisMemoryServerURI = async (): Promise<string> => {
  redis = await RedisMemoryServer.create();

  return `redis://${await redis.getHost()}:${await redis.getPort()}`;
};

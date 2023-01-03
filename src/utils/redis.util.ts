import { createClient } from 'redis';
import { REDIS_URL } from '@config';
import { RedisClientType } from '@redis/client/dist/lib/client';
import { logger } from '@utils/logger';

export const client = () => {
  const _client: RedisClientType = createClient({
    url: REDIS_URL,
  });
  return _client;
};

// instantiate the redis client
export const redisClientSingleton = REDIS_URL ? client() : null;

export const getFromCache = async (key: string) => {
  if (!redisClientSingleton) {
    return null;
  }
  const assetData = await redisClientSingleton.get(key);
  if (assetData) {
    return JSON.parse(assetData);
  } else {
    return null;
  }
};

export const saveToCache = async (key, ttl, data) => {
  if (!redisClientSingleton) {
    return null;
  }
  await redisClientSingleton.setEx(key, ttl, JSON.stringify(data));
};

export const saveSortedSetData = async (setName, key, data) => {
  if (!redisClientSingleton) {
    return null;
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  await redisClientSingleton.zAdd(setName, key, JSON.stringify(data));
};

export const getSortedSetData = async (setName, start, end) => {
  if (!redisClientSingleton) {
    return null;
  }
  const records = await redisClientSingleton.zRangeByScore(setName, start, end, 'WITHSCORES');
  return records || null;
};

function setupRedisConnection() {
  if (!redisClientSingleton) {
    return null;
  }
  redisClientSingleton.connect().then(() => {
    redisClientSingleton.on('error', handleRedisConnectionError);
  });
}

function handleRedisConnectionError(error) {
  const timeout = 1200;
  setTimeout(() => {
    logger.error(`redis connection error, attempt to reset in ${timeout}ms`, error);
    redisClientSingleton.disconnect().then(() => {
      setupRedisConnection();
    });
  }, timeout);
}

// initialize the redis connection
setupRedisConnection();

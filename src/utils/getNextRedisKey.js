import { connectToRedis } from "./";
const redis = connectToRedis();

const getNextRedisKey = async (queryString) => {
  let keys = await redis.hkeys(queryString);
  keys = keys.map((key) => parseInt(key)).sort((a, b) => a - b);
  return keys.length ? keys[keys.length - 1] + 1 : 0;
};

export default getNextRedisKey;

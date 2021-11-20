import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL);

export default async function handler(req, res) {
  const { name } = req.body;

  // get spots id's
  let keys = await redis.hkeys("spots");
  keys = keys.map((key) => parseInt(key)).sort((a, b) => a - b);
  const nextKey = keys.length ? keys[keys.length - 1] + 1 : 0;

  // set new spot
  await redis.hset("spots", nextKey, JSON.stringify({ id: nextKey, name }));

  res.status(200).json({ success: true });
}

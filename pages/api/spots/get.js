import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL);

export default async function handler(req, res) {
  const spotsHash = await redis.hgetall("spots");
  const spotsArray = Object.keys(spotsHash).map((key) =>
    JSON.parse(spotsHash[key])
  );
  res.status(200).json(spotsArray);
}

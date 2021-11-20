import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL);

export default async function handler(req, res) {
  const { name, score } = req.body;
  console.log({ name, score });
  res.status(200).json({ success: true });
}

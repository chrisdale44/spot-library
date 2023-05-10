import { connectToRedis } from "../../../utils";

const redis = connectToRedis();

export default async function handler(req, res) {
  const newTags = req.body;

  try {
    const args = newTags.flatMap(({ id, name }) => [id, name]);

    const result = await redis.hset("tags", ...args);

    res.status(200).json({ success: true, result });
  } catch (err) {
    console.error(err);
  }
}

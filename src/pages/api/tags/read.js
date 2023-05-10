import { connectToRedis } from "../../../utils";

const redis = connectToRedis();

export default async function handler(req, res) {
  try {
    const tagsHash = await redis.hgetall("tags");

    const tagsArray = Object.keys(tagsHash).map((key) => ({
      id: parseInt(key),
      name: tagsHash[key],
    }));
    console.log(tagsArray);

    res.status(200).json(tagsArray);
  } catch (err) {
    console.error(err);
  }
}

import { connectToRedis } from "../../../utils";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "5mb",
    },
  },
};

const redis = connectToRedis();

export default async function handler(req, res) {
  const { id } = req.body;

  try {
    const result = await redis.hdel("spots", id);
    res.status(200).json({ success: true, id, result });
  } catch (err) {
    console.error(err);
  }
}

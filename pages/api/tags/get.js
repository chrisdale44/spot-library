import connectToRedis from "../../../utils/connectToRedis";

const redis = connectToRedis();

export default async function handler(req, res) {
  const { name, score } = req.body;
  console.log({ name, score });
  res.status(200).json({ success: true });
}

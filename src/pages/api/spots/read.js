import { connectToRedis } from "../../../utils";

const redis = connectToRedis();

export default async function handler(req, res) {
  try {
    const spotsHash = await redis.hgetall("spots");
    console.log(spotsHash);
    const spotsArray = Object.keys(spotsHash).map((key) =>
      JSON.parse(spotsHash[key])
    );

    res.status(200).json(spotsArray);
  } catch (err) {
    console.error(err);
  }
}

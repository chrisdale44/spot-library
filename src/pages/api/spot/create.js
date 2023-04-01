import { format } from "date-fns";
import { connectToRedis, getNextRedisKey } from "../../../utils";
import { SPOT_FIELDS } from "../../../constants";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "5mb",
    },
  },
};

const redis = connectToRedis();

export default async function handler(req, res) {
  const spot = req.body;

  res.status(200);
  try {
    // get any existing spots id's
    const nextKey = await getNextRedisKey("spots");
    const currentTime = format(Date.now(), "yyyy-MM-dd HH:mm:ss.SS");

    const args = [
      nextKey,
      JSON.stringify({
        ...SPOT_FIELDS,
        ...spot,
        id: nextKey,
        created_at: currentTime,
        updated_at: currentTime,
      }),
    ];

    // add new spot to the spots hash
    const result = await redis.hset("spots", ...args);

    res.status(200).json({ success: true, result, id: nextKey });
  } catch (err) {
    console.error(err);
  }
}

import { format } from "date-fns";
import { connectToRedis } from "../../../utils";
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
    const currentTime = format(Date.now(), "yyyy-MM-dd HH:mm:ss.SS");
    console.log(spot.id);

    const args = [
      spot.id,
      JSON.stringify({
        ...SPOT_FIELDS,
        ...spot,
        created_at: currentTime,
        updated_at: currentTime,
      }),
    ];

    // add new spot to the spots hash
    await redis.hset("spots", ...args);

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
  }
}

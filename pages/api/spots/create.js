import { format } from "date-fns";
import connectToRedis from "../../../utils/connectToRedis";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "5mb",
    },
  },
};

const redis = connectToRedis();
const defaultFields = {
  name: "",
  description: "",
  coordinates: [],
  imgUrls: [],
  images: [],
  media: [],
};

export default async function handler(req, res) {
  const { spots } = req.body;

  console.log(spots);

  res.status(200);
  try {
    // get spots id's
    let keys = await redis.hkeys("spots");
    keys = keys.map((key) => parseInt(key)).sort((a, b) => a - b);
    const nextKey = keys.length ? keys[keys.length - 1] + 1 : 0;

    const currentTime = format(Date.now(), "yyyy-MM-dd HH:mm:ss.SS");

    // create an array [key, value, key, value, etc]
    const args = spots.flatMap((spot, i) => {
      const id = nextKey + i;
      return [
        id,
        JSON.stringify({
          ...defaultFields,
          ...spot,
          id,
          created_at: currentTime,
          updated_at: currentTime,
        }),
      ];
    });

    // set new spot(s)
    await redis.hset("spots", ...args);

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
  }
}

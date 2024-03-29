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
  const { spots } = req.body;

  res.status(200);
  try {
    // get any existing spots id's
    const nextKey = await getNextRedisKey("spots");

    const currentTime = format(Date.now(), "yyyy-MM-dd HH:mm:ss.SS");

    // create an array of key value pairs for our redis hash
    // [spotId, stringifiedObject, spotID, stringifiedObject, etc]
    // Storing all spots in one hash allows us to query all spots in 1 request,
    // rather than multiple if each spot is stored as its own hash
    // Scalability? A hash can store over 4bn key value pairs
    // The single server request can get very large though
    const args = spots.flatMap((spot, i) => {
      const id = nextKey + i;
      return [
        id,
        // hashes can't be nested inside hashes so we stringify the object
        // one downside is that we can't query individual fields but this is not required for our purposes
        JSON.stringify({
          ...SPOT_FIELDS,
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

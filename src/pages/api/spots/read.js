import { connectToRedis } from "../../../utils";

const redis = connectToRedis();

export default async function handler(req, res) {
  try {
    // const spotsHash = await redis.hgetall("spots");
    // // console.log(spotsHash);
    // const spotsArray = Object.keys(spotsHash).map((key) =>
    //   JSON.parse(spotsHash[key])
    // );
    // console.log(spotsArray);
    const spotsArray = [
      {
        name: "Arsenal Stadium ledges",
        description: "Stoppied",
        coordinates: ["51.556129", "-0.107846"],
        imgUrls: [],
        images: [],
        media: [],
        id: 0,
        created_at: "2023-05-09 18:19:34.53",
        updated_at: "2023-05-09 18:19:34.53",
      },
    ];
    res.status(200).json(spotsArray);
  } catch (err) {
    console.error(err);
  }
}

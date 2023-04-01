import { v2 as cloudinary } from "cloudinary";

export default async function handler(req, res) {
  const uploadParams = req.body;
  const apiSecret = process.env.NEXT_PUBLIC_CLOUD_API_SECRET;
  const timestamp = Math.round(new Date().getTime() / 1000);

  try {
    // Required params to generate signature:
    // ALL params incl. timestamp
    // EXCEPT: file, cloud_name, resource_type, api_key
    const signature = await cloudinary.utils.api_sign_request(
      { ...uploadParams, timestamp },
      apiSecret
    );

    res.status(200).json({ signature, timestamp });
  } catch (error) {
    console.error(error);
    res.send(error);
  }
}

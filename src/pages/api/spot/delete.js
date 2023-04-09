import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  secure: true,
});

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "5mb",
    },
  },
};

export default async function handler(req, res) {
  const filesToDelete = req.body;

  try {
    cloudinary.api.delete_resources(filesToDelete).then((result) => {
      res.status(200).json({ success: true, result });
    });
  } catch (err) {
    console.error(err);
  }
}

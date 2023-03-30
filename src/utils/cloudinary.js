import { THUMB_TRANSFORMATION } from "../constants/cloudinary";

export const stripCloudinaryDomain = (url) => {
  if (!url) {
    return;
  }
  return url
    .replace("http://res.cloudinary.com/dsjx8r2ll/image/upload/", "")
    .replace("https://res.cloudinary.com/dsjx8r2ll/image/upload/", "");
};

export const getCloudinaryThumb = (url) => {
  if (!url) {
    return;
  }

  const splitPoint = "/upload";
  const urlParts = url.split(splitPoint);
  return `${urlParts[0]}${splitPoint}/${THUMB_TRANSFORMATION}${urlParts[1]}`;
};

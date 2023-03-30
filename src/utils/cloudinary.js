import THUMB_TRANSFORMATION from "../constants/cloudinary";

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
  const urlParts = url.split("/upload");
  return `/${THUMB_TRANSFORMATION}${urlParts[1]}`;

  c_crop, h_200, w_200;
};

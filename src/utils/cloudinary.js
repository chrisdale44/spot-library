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
  return `/w_200,h_200,c_fill${urlParts[1]}`;
};

export const getCloudinaryId = (url) => {
  const urlParts = url.split("/");
  return `${urlParts[urlParts.length - 2]}/${urlParts[
    urlParts.length - 1
  ].replace(".webp", "")}`;
};

import { IMAGES, MEDIA } from "../../../constants";

export const filterExifData = (exifData, fileType) => {
  const desiredData = {
    [IMAGES]: ["latitude", "longitude", "DateTimeOriginal"],
    [MEDIA]: [
      "latitude",
      "longitude",
      "DateTimeOriginal",
      "Make",
      "Model",
      "LensModel",
      "FNumber",
      "ExposureTime",
      "ISO",
      "Flash",
    ],
  };

  return desiredData[fileType].reduce((obj, key) => {
    if (exifData[key]) obj[key] = exifData[key];
    return obj;
  }, {});
};

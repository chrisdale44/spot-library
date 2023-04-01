import exifr from "exifr";
import haversine from "haversine";
import { filterExifData } from "./utils";

const areLocationsWithinRange = (pointA, pointB, range) => {
  const distanceBetweenPoints = haversine(pointA, pointB, { unit: "meter" });

  if (distanceBetweenPoints > range) {
    return false;
  }
  return true;
};

export const extractExifData = async (
  file,
  fileType,
  spotLatLng,
  handleExifLocationMismatch
) => {
  const newFile = {
    file,
    path: file.path,
    size: file.size,
    preview: URL.createObjectURL(file),
  };

  return await exifr
    .parse(file)
    .then((exifData) => {
      if (exifData.latitude && exifData.longitude) {
        if (
          !areLocationsWithinRange(
            { latitude: spotLatLng.lat, longitude: spotLatLng.lng },
            { latitude: exifData.latitude, longitude: exifData.longitude },
            50
          )
        ) {
          handleExifLocationMismatch({
            lat: exifData.latitude,
            lng: exifData.longitude,
          });
        }
      }

      return {
        ...newFile,
        exif: filterExifData(exifData, fileType),
      };
    })
    .catch((e) => {
      console.error("Failed to extract exif data", e);
      // exif data failed, push file data anyway
      return newFile;
    });
};

import exifr from "exifr";
import haversine from "haversine";
import Dialog from "../../Modal/Dialog";
import { filterExifData } from "./utils";

const relocatePinDialog = (latLng, relocatePin) => (
  <Dialog yesCallback={() => relocatePin(latLng)}>
    <p>Image was taken at different location to pin.</p>
    <p>Do you want to relocate the pin?</p>
  </Dialog>
);

export const handleLocationMismatch = (newCoordinates) => {
  setModal(relocatePinDialog(newCoordinates, relocatePin));
};

export const areLocationsWithinRange = (pointA, pointB, range) => {
  const distanceBetweenPoints = haversine(pointA, pointB, { unit: "meter" });

  if (distanceBetweenPoints > range) {
    return false;
  }
  return true;
};

export const extractExifData = async (spotLatLng) => {
  const newFile = {
    file,
    path: file.path,
    size: file.size,
    preview: URL.createObjectURL(file),
  };

  await exifr
    .parse(file)
    .then((exifData) => {
      console.log(exifData);
      if (exifData.latitude && exifData.longitude) {
        if (
          !areLocationsWithinRange(
            { latitude: spotLatLng.lat, longitude: spotLatLng.lng },
            { latitude: exifData.latitude, longitude: exifData.longitude },
            50
          )
        ) {
          handleLocationMismatch();
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

  return acceptedFiles;
};

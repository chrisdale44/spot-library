import { bytesInMb, bytesInKb } from "./constants";

export const parseBytes = (size) => {
  if (size < 500) {
    return `${size} bytes`;
  }

  if (size < 500 * bytesInKb) {
    const kiloBytes = size / bytesInKb;
    return `${kiloBytes.toFixed(1)} KB`;
  }

  const megaBytes = size / bytesInMb;
  return `${megaBytes.toFixed(1)} MB`;
};

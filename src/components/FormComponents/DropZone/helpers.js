import { bytesInMb, bytesInKb } from "./constants";

export const parseBytes = (size) => {
  console.log(size);
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

export const parseError = (string, minFileSize, maxFileSize) =>
  string
    .replace(`${minFileSize} bytes`, parseBytes(minFileSize))
    .replace(`${maxFileSize} bytes`, parseBytes(maxFileSize));

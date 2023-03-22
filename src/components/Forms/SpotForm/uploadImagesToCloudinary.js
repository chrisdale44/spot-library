import axios from "axios";

const uploadImagesToCloudinary = (
  data,
  files,
  uploadParams,
  setIsLoading,
  callback
) => {
  const { signature, timestamp } = data;
  const promises = [];
  for (const fileData of files) {
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/image/upload`;
    const formData = new FormData();

    // file manipulations are handled through the cloudinary web portal
    formData.append("file", fileData.file);
    formData.append("api_key", process.env.NEXT_PUBLIC_CLOUD_API_KEY);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);

    for (const [param, value] of Object.entries(uploadParams)) {
      formData.append(param, value);
    }

    promises.push(
      axios
        .post(cloudinaryUrl, formData, {
          enctype: "multipart/form-data",
        })
        .then(async ({ data }) => {
          callback(data);
        })
        .catch(function (error) {
          console.error(error);
          setIsLoading(false);
        })
    );
  }
  return promises;
};

export default uploadImagesToCloudinary;

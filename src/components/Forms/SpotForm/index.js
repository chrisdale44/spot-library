import React, { useState } from "react";
import axios from "axios";
import DropZone from "../../FormComponents/DropZone";
import LoadingSpinner from "../../SVGs/LoadingSpinner";
import styles from "./SpotForm.module.scss";

const SpotForm = ({ id }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [acceptedSpotFiles, setAcceptedSpotFiles] = useState([]);
  // const [acceptedMediaFiles, setAcceptedMediaFiles] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Upload images to Cloudinary
    const generateSignatureEndpoint = `/api/sign`;
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/image/upload`;

    // Call serverless fn to generate a hexadecimal auth signature from request params
    // Params should exclude: file, cloud_name, resource_type, api_key
    axios.post(generateSignatureEndpoint).then(({ data }) => {
      const { signature, timestamp } = data;

      for (const fileData of acceptedSpotFiles) {
        const formData = new FormData();

        // file manipulations are handled through the cloudinary web portal
        formData.append("file", fileData.file);
        formData.append("api_key", process.env.NEXT_PUBLIC_CLOUD_API_KEY);
        formData.append("timestamp", timestamp);
        formData.append("signature", signature);

        axios
          .post(cloudinaryUrl, formData, {
            enctype: "multipart/form-data",
          })
          .then((response) => {
            console.log(response);

            // add cloudinary urls to form data

            // submit form data to redis

            // add spot to recoil state

            // done - end loading state
            setIsLoading(false);
          })
          .catch(function (error) {
            console.log(error);
            setIsLoading(false);
          });
      }
    });
    // set loading state
  };

  return (
    <div className={styles.formWrapper}>
      <h3 className={styles.heading}>{id ? "Edit" : "Create new"} spot</h3>
      <form className={styles.spotForm} onSubmit={handleSubmit}>
        <input placeholder="Spot name" />
        <textarea placeholder="Description" />
        <DropZone
          acceptedFiles={acceptedSpotFiles}
          setAcceptedFiles={setAcceptedSpotFiles}
        />
        <button disabled={isLoading} type="submit">
          {isLoading ? <LoadingSpinner size={22} /> : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default SpotForm;

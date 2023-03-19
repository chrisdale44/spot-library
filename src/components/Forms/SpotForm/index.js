import React, { useState, useRef } from "react";
import axios from "axios";
import { useRecoilState } from "recoil";
import { mapState as mapRecoilState, popupState } from "../../../state";
import useSpotActions from "../../../state/spots/actions";
import DropZone from "../../FormComponents/DropZone";
import LoadingSpinner from "../../SVGs/LoadingSpinner";
import styles from "./SpotForm.module.scss";
import { SPOT_FIELDS } from "../../../constants";

const uploadImageToCloudinary = (files, callback) => {
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
          console.log(error);
          setIsLoading(false);
        })
    );
  }
  return promises;
};

const SpotForm = ({ id }) => {
  const [popup, setPopup] = useRecoilState(popupState);
  const [, setMapState] = useRecoilState(mapRecoilState);
  const { addSpot } = useSpotActions();
  const [isLoading, setIsLoading] = useState(false);
  const [acceptedSpotFiles, setAcceptedSpotFiles] = useState([]);
  const [acceptedMediaFiles, setAcceptedMediaFiles] = useState([]);
  const spotForm = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Upload images to Cloudinary
    const generateSignatureEndpoint = `/api/cloudinary/sign`;

    const uploadParams = {
      folder: "spot-mapper",
      eager: "c_crop,h_200,w_200",
    };

    // Call serverless fn to generate a hexadecimal auth signature from request params
    // Params should exclude: file, cloud_name, resource_type, api_key
    axios.post(generateSignatureEndpoint, uploadParams).then(({ data }) => {
      const { signature, timestamp } = data;

      const payload = {
        ...SPOT_FIELDS,
        name: e.target.name.value,
        description: e.target.description.value,
        coordinates: popup.position,
        images: [],
      };
      const promises = [];

      // upload images to cloudinary
      promises.push(
        uploadImageToCloudinary(acceptedSpotFiles, (data) => {
          payload.images.push(data);
        })
      );

      // upload media images to cloudinary
      promises.push(
        uploadImageToCloudinary(acceptedMediaFiles, (data) => {
          payload.media.push(data);
        })
      );

      // wait for all images to finish uploading
      Promise.all(promises)
        .then(() => {
          // add spot to redis via api call
          return axios.post("/api/spot/create", payload);
        })
        .finally(() => {
          spotForm.current.reset();
          setAcceptedSpotFiles([]);
          setIsLoading(false);
          setPopup(null);
          setMapState("default");
          addSpot(payload);
        });
    });
  };

  return (
    <div className={styles.formWrapper}>
      <h3 className={styles.heading}>{id ? "Edit" : "Create new"} spot</h3>
      <form ref={spotForm} className={styles.spotForm} onSubmit={handleSubmit}>
        <input name="name" placeholder="Spot name" />
        <textarea name="description" placeholder="Description" />
        <DropZone
          fileType={"images"}
          acceptedFiles={acceptedSpotFiles}
          setAcceptedFiles={setAcceptedSpotFiles}
        />
        <DropZone
          fileType={"media"}
          acceptedFiles={acceptedMediaFiles}
          setAcceptedFiles={setAcceptedMediaFiles}
        />
        <button disabled={isLoading} type="submit">
          {isLoading ? <LoadingSpinner size={22} /> : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default SpotForm;

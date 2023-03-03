import React, { useState } from "react";
import DropZone from "../../FormComponents/DropZone";
import LoadingSpinner from "../../SVGs/LoadingSpinner";
import styles from "./SpotForm.module.scss";

const SpotForm = ({ id }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [acceptedSpotFiles, setAcceptedSpotFiles] = useState([]);
  // const [acceptedMediaFiles, setAcceptedMediaFiles] = useState([]);

  const handleSubmit = (e) => {
    console.log("submit");
    e.preventDefault();
    // set loading state
    setIsLoading(true);
    // send files to cloudinary
    // add cloudinary urls to form data
    // submit form data to redis
    // add spot to recoil state
    // done - end loading state
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

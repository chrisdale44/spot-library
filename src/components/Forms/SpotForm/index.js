import React, { useEffect, useState } from "react";
import DropZone from "../../FormComponents/DropZone";
import styles from "./SpotForm.module.scss";

const SpotForm = ({ id }) => {
  const [acceptedSpotFiles, setAcceptedSpotFiles] = useState([]);
  // const [acceptedMediaFiles, setAcceptedMediaFiles] = useState([]);

  useEffect(() => {
    console.log(acceptedSpotFiles);
  }, [acceptedSpotFiles]);

  return (
    <div className={styles.formWrapper}>
      <h3 className={styles.heading}>{id ? "Edit" : "Create new"} spot</h3>
      <form className={styles.spotForm}>
        <input placeholder="Spot name" />
        <textarea placeholder="Description" />
        <DropZone
          acceptedFiles={acceptedSpotFiles}
          setAcceptedFiles={setAcceptedSpotFiles}
        />
        <input type="submit" />
      </form>
    </div>
  );
};

export default SpotForm;

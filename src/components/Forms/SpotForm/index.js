import React, { useEffect, useState } from "react";
import DropZone from "../../FormComponents/DropZone";
import styles from "./SpotForm.module.scss";

const SpotForm = ({ id }) => {
  const [acceptedFiles, setAcceptedFiles] = useState([]);

  useEffect(() => {
    console.log(acceptedFiles);
  }, [acceptedFiles]);

  return (
    <div className={styles.formWrapper}>
      <h3 className={styles.heading}>{id ? "Edit" : "Create new"} spot</h3>
      <form className={styles.spotForm}>
        <input placeholder="Spot name" />
        <textarea placeholder="Description" />
        <DropZone
          name="spot"
          acceptedFiles={acceptedFiles}
          setAcceptedFiles={setAcceptedFiles}
        />
        <input type="submit" />
      </form>
    </div>
  );
};

export default SpotForm;

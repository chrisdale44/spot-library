import React from "react";
import styles from "./SpotForm.module.scss";

const SpotForm = ({ id }) => {
  if (id) {
    // fetch spot data and popuplate form
  }

  return (
    <>
      <h2 className={styles.heading}>{id ? "Edit" : "Create"} Spot</h2>
      <form className={styles.spotForm}>
        <input />
        <input />
        <input />
        <input type="file" />
        <input type="submit" />
      </form>
    </>
  );
};

export default SpotForm;

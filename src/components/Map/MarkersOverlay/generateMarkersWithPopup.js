import React from "react";
import Image from "next/image";
import { getCloudinaryThumb } from "../../../utils/cloudinary";
import styles from "./MarkersOverlay.module.scss";

const generateMarkersWithPopup = (
  spots,
  markerClickHandler,
  popupClickHandler
) => {
  return spots.map(({ id, name, coordinates, images }) => {
    const popupContent = (
      <div
        className={styles.popupContainer}
        onClick={() => popupClickHandler(id)}
      >
        {images.length ? (
          <Image
            loading="lazy"
            src={getCloudinaryThumb(images[0].url)}
            layout="fill"
          />
        ) : null}
        <h3>{name}</h3>
      </div>
    );
    return {
      id,
      iconColor: "#187bcd",
      coordinates: [parseFloat(coordinates[0]), parseFloat(coordinates[1])],
      interactive: true,
      buttonMode: true,
      tap: () => markerClickHandler(coordinates, popupContent),
      click: () => markerClickHandler(coordinates, popupContent),
    };
  });
};

export default generateMarkersWithPopup;

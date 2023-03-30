import React from "react";
import Image from "next/image";
import classNames from "classnames";
import { getCloudinaryThumb } from "../../../utils/cloudinary";
import styles from "./MarkersOverlay.module.scss";

let cx = classNames.bind(styles);

const generateMarkersWithPopup = (
  spots,
  markerClickHandler,
  popupClickHandler
) => {
  return spots.map(({ id, name, coordinates, images }) => {
    const hasImages = !!images.length;
    const hasImagesClass = cx({
      "has-images": hasImages,
      [styles.hasImages]: hasImages,
    });

    const popupContent = (
      <div
        className={styles.popupContainer}
        onClick={() => popupClickHandler(id)}
      >
        {images.length ? (
          <img
            loading="lazy"
            decoding="async"
            src={getCloudinaryThumb(images[0].url)}
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
      tap: () =>
        markerClickHandler(coordinates, popupContent, {
          className: hasImagesClass,
        }),
      click: () =>
        markerClickHandler(coordinates, popupContent, {
          className: hasImagesClass,
        }),
    };
  });
};

export default generateMarkersWithPopup;

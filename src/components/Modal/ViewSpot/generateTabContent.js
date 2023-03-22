import React from "react";
import ImageGallery from "react-image-gallery";
import styles from "./Spot.module.scss";

const generateTabContent = (tabs) =>
  tabs.map(({ title, images }) => ({
    title,
    content: !images?.length ? (
      <p>No images yet</p>
    ) : (
      <div className={styles.galleryWrapper}>
        <ImageGallery
          items={images.map((image) => ({
            original: image.url,
            loading: "eager",
          }))}
          showPlayButton={false}
          showFullscreenButton={true}
        />
      </div>
    ),
  }));

export default generateTabContent;

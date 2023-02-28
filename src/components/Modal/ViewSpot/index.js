import React, { useState } from "react";
import { useRecoilState } from "recoil";
import useSpotSelectors from "../../../state/spots/selectors";
import { GrEdit } from "react-icons/gr";
import { SiGooglemaps } from "react-icons/si";
// import { FiExternalLink } from "react-icons/fi";
import ImageGallery from "react-image-gallery";
import Tabs from "../../Tabs";
import { getStreetViewLink } from "../../../utils/googlemaps";
import { modalState } from "../../../state";
import styles from "./Spot.module.scss";

const ViewSpot = ({ id }) => {
  const [modal, setModal] = useRecoilState(modalState);
  const { getSpot } = useSpotSelectors();
  const spot = getSpot(id);
  console.log(id, spot);
  const { name, description, images, imgUrls, media, coordinates } = spot;

  console.log(spot);

  const handleEdit = (e) => {
    setModal({
      type: "editSpot",
      id,
    });
  };

  return spot ? (
    <>
      <h3 class={styles.spotName}>{name}</h3>
      {description && <p>{description}</p>}

      <Tabs />
      <div className={styles.galleryWrapper}>
        {images.length ? (
          <ImageGallery
            items={images.map((image) => ({
              original: image.url,
              loading: "eager",
            }))}
            showPlayButton={false}
            showFullscreenButton={true}
          />
        ) : null}
      </div>

      <div className={styles.iconWrapper}>
        <a
          href={getStreetViewLink(coordinates)}
          target="_blank"
          rel="noreferrer"
        >
          <SiGooglemaps className={styles.googlemaps} />
        </a>
        {/* <a href={`/spot/${id}`} className={styles.edit}>
        <FiExternalLink />
      </a> */}
        <a onClick={handleEdit}>
          <GrEdit />
        </a>
      </div>
    </>
  ) : null;
};

export default ViewSpot;

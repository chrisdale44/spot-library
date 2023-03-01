import React from "react";
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

const ViewSpot = ({ id }) => {
  const [, setModal] = useRecoilState(modalState);
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
      <h3 className={styles.spotName}>{name}</h3>
      {description && <p>{description}</p>}

      <Tabs
        tabs={generateTabContent([
          { title: "Spot check", images },
          { title: "Covers baby", images: media },
        ])}
      />

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

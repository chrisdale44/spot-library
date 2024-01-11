import React from "react";
import { useRecoilState } from "recoil";
import { mapState as mapRecoilState, modalState } from "../../../state";
import ImageGallery from "react-image-gallery";
import { GrEdit } from "react-icons/gr";
import { SiGooglemaps } from "react-icons/si";
// import { FiExternalLink } from "react-icons/fi";
import Tabs from "../../Tabs";
import { getStreetViewLink } from "../../../utils/googlemaps";
import { IMAGES, MEDIA } from "../../../constants";
import styles from "./Spot.module.scss";

const ViewSpot = ({ spot }) => {
  const { id, name, description, coordinates } = spot;
  const [, setMapState] = useRecoilState(mapRecoilState);
  const [, setModal] = useRecoilState(modalState);

  const handleOpenEditSpot = () => {
    setMapState({ id: "editSpot", spotId: id });
    setModal(null);
  };

  return spot ? (
    <div className={styles.wrapper}>
      <h3 className={styles.spotName}>{name}</h3>
      {description && <p>{description}</p>}

      <Tabs headings={["Spot", "Media"]}>
        {[IMAGES, MEDIA].map((type, i) =>
          !spot[type]?.length ? (
            <p key={i}>No images yet</p>
          ) : (
            <div className={styles.galleryWrapper} key={i}>
              <ImageGallery
                items={spot[type].map((image) => ({
                  original: image.url,
                  loading: "lazy",
                }))}
                showPlayButton={false}
                showFullscreenButton={false}
              />
            </div>
          )
        )}
      </Tabs>

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
        {/* <button onClick={handleOpenEditSpot}>
          <GrEdit />
        </button> */}
      </div>
    </div>
  ) : null;
};

export default ViewSpot;

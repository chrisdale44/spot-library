import React from "react";
import { useRecoilState } from "recoil";
import PropTypes from "prop-types";
import { GrEdit } from "react-icons/gr";
import { SiGooglemaps } from "react-icons/si";
import ViewSpot from "../../Modal/ViewSpot";
import { getStreetViewLink } from "../../../utils/googlemaps";
import { modalState } from "../../../state";
import { getCloudinaryThumb } from "../../../utils/cloudinary";
import styles from "./Tile.module.scss";

const Tile = ({ spot }) => {
  const { id, name, images, coordinates } = spot;
  const [, setModal] = useRecoilState(modalState);
  const handleClick = (id) => {
    setModal(<ViewSpot spot={spot} />);
  };

  return (
    <div className={styles.tile}>
      <div className={styles.topBanner}>{name}</div>
      {images?.length ? (
        <img
          src={getCloudinaryThumb(images[0].url)}
          alt={name}
          loading="lazy"
          decoding="async"
          onClick={() => handleClick(id)}
        />
      ) : null}
      <div className={styles.bottomBanner}>
        <a
          href={getStreetViewLink(coordinates)}
          target="_blank"
          rel="noreferrer"
        >
          <SiGooglemaps className={styles.googlemaps} />
        </a>
        <a href={`/spot/${id}/edit`}>
          <GrEdit className={styles.edit} />
        </a>
      </div>
    </div>
  );
};

Tile.propTypes = {
  spot: PropTypes.object.isRequired,
};

export default Tile;

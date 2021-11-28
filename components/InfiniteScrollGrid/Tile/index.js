import React from "react";
import Link from "next/link";
import PropTypes from "prop-types";
import { GrEdit } from "react-icons/gr";
import { SiGooglemaps } from "react-icons/si";
import LazyImage from "../../LazyImage";
import { getStreetViewLink } from "../../../utils/googlemaps";
import styles from "./Tile.module.scss";

const Tile = ({ item }) => {
  const { id, name, images, coordinates } = item;
  const handleClick = () => {
    //   dispatch({
    //     type: "OPEN_MODAL",
    //     payload: id,
    //   });
  };

  let tileParams;
  if (images?.length) {
    const urlParts = images[0].url.split("/upload");
    tileParams = `w_200,h_200,c_fill${urlParts[1]}`;
  }

  return (
    <div className={styles.tile}>
      {images?.length ? (
        <LazyImage
          src={tileParams}
          className={styles.coverImg}
          wrapperClassname={styles.coverImg}
          onClick={handleClick}
        />
      ) : null}
      <div className={styles.topBanner}>{name}</div>
      <br />
      <br />
      <br />
      <div className={styles.bottomBanner}>
        <a href={getStreetViewLink(coordinates)} target="_blank" rel="noreferrer">
          <SiGooglemaps className={styles.googlemaps} />
        </a>
        <a href={`/spot/${id}/edit`}>
          <GrEdit className={styles.edit} />
        </a>
      </div>
    </div>
  );
};

Tile.protoTypes = {
  spot: PropTypes.object,
};

export default Tile;

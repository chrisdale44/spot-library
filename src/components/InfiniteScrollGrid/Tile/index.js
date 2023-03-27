import React from "react";
import { useRecoilState } from "recoil";
import PropTypes from "prop-types";
import { GrEdit } from "react-icons/gr";
import { SiGooglemaps } from "react-icons/si";
import Image from "next/image";
import ViewSpot from "../../Modal/ViewSpot";
import { getStreetViewLink } from "../../../utils/googlemaps";
import { modalState } from "../../../state";
import { getCloudinaryThumb } from "../../../utils/cloudinary";
import styles from "./Tile.module.scss";

const Tile = ({ item }) => {
  const { id, name, images, coordinates } = item;
  const [, setModal] = useRecoilState(modalState);
  const handleClick = (id) => {
    setModal(<ViewSpot id={id} />);
  };

  return (
    <div className={styles.tile}>
      <div className={styles.topBanner}>{name}</div>
      {images?.length ? (
        <div className={styles.imageWrapper}>
          <Image
            src={getCloudinaryThumb(images[0].url)}
            alt={name}
            loading="lazy"
            layout="fill"
            onClick={() => handleClick(id)}
          />
        </div>
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

Tile.protoTypes = {
  spot: PropTypes.object,
};

export default Tile;

import React from "react";
import { useRecoilState } from "recoil";
import PropTypes from "prop-types";
import { GrEdit } from "react-icons/gr";
import { SiGooglemaps } from "react-icons/si";
import Image from "next/image";
import { getStreetViewLink } from "../../../utils/googlemaps";
import { modalState } from "../../../state";
import styles from "./Tile.module.scss";

const Tile = ({ item }) => {
  const { id, name, images, coordinates } = item;
  const [, setModal] = useRecoilState(modalState);
  const handleClick = (id) => {
    setModal({
      type: "spot",
      id,
    });
  };

  let imgUrl;
  if (images?.length) {
    const urlParts = images[0].url.split("/upload");
    imgUrl = `/w_200,h_200,c_fill${urlParts[1]}`;
  }

  return (
    <div className={styles.tile}>
      <div className={styles.topBanner}>{name}</div>
      {images?.length ? (
        <div className={styles.imageWrapper}>
          <Image
            src={imgUrl}
            alt="alt"
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

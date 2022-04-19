import React from "react";
import { useRecoilValue } from "recoil";
import { getSpot } from "../../../state";
import { GrEdit } from "react-icons/gr";
import { SiGooglemaps } from "react-icons/si";
import { FiExternalLink } from "react-icons/fi";
import { getStreetViewLink } from "../../../utils/googlemaps";
import styles from "../Modal.module.scss";

const Spot = ({ id }) => {
  const spot = useRecoilValue(getSpot(id));
  return (
    <>
      <a
        href={getStreetViewLink(spot.coordinates)}
        target="_blank"
        rel="noreferrer"
      >
        <SiGooglemaps className={styles.googlemaps} />
      </a>
      <a href={`/spot/${id}`} className={styles.edit}>
        <FiExternalLink />
      </a>
      <a href={`/spot/${id}/edit`} className={styles.edit}>
        <GrEdit />
      </a>

      <br />
      <br />
      {spot.name}
    </>
  );
};

export default Spot;

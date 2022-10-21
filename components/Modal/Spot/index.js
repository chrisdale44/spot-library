import React from "react";
import { useRecoilValue } from "recoil";
import useSpotSelectors from "../../../state/spots/selectors";
import { GrEdit } from "react-icons/gr";
import { SiGooglemaps } from "react-icons/si";
import { FiExternalLink } from "react-icons/fi";
import { getStreetViewLink } from "../../../utils/googlemaps";
import styles from "../Modal.module.scss";

const Spot = ({ id }) => {
  const { getSpot } = useSpotSelectors();
  const spot = getSpot(id);

  return spot ? (
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
  ) : null;
};

export default Spot;

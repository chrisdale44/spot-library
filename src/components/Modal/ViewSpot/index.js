import React from "react";
import { useRecoilState } from "recoil";
import SpotForm from "../../Forms/SpotForm";
import { modalState, popupState } from "../../../state";
import useSpotSelectors from "../../../state/spots/selectors";
import { GrEdit } from "react-icons/gr";
import { SiGooglemaps } from "react-icons/si";
// import { FiExternalLink } from "react-icons/fi";
import Tabs from "../../Tabs";
import { getStreetViewLink } from "../../../utils/googlemaps";
import generateTabContent from "./generateTabContent";
import styles from "./Spot.module.scss";

const ViewSpot = ({ id }) => {
  const [, setPopup] = useRecoilState(popupState);
  const [, setModal] = useRecoilState(modalState);
  const { getSpot } = useSpotSelectors();
  const spot = getSpot(id);
  const { name, description, images, imgUrls, media, coordinates } = spot;

  const relocatePin = (latLng) => {
    setSpotLayerPoint(latLngToLayerPoint(latLng));
    setPopup({
      ...stateRef.popup,
      position: [latLng.lat, latLng.lng],
    });
  };

  const openEditSpot = () => {
    console.log(spot);
    setPopup({
      position: spot.coordinates,
      content: (
        <SpotForm
          latlng={{ lat: spot.coordinates[0], lng: spot.coordinates[1] }}
          id={id}
          spot={spot}
          relocatePin={relocatePin}
        />
      ),
    });
    setModal(null);
  };

  return spot ? (
    <div className={styles.wrapper}>
      <h3 className={styles.spotName}>{name}</h3>
      {description && <p>{description}</p>}

      <Tabs
        tabs={generateTabContent([
          { title: "Spot", images },
          { title: "Media", images: media },
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
        <a onClick={openEditSpot}>
          <GrEdit />
        </a>
      </div>
    </div>
  ) : null;
};

export default ViewSpot;

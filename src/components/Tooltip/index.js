import React, { useState } from "react";
import { BiEditAlt, BiListUl } from "react-icons/bi";
import { SiGooglestreetview } from "react-icons/si";
import { Popup } from "react-leaflet";
import EditSpotForm from "../Forms/EditSpotForm";
import Tag from "../Tag";
import { getStreetViewLink } from "../../utils/googlemaps";
import styles from "./Tooltip.module.scss";

const Tooltip = ({ spot, isNewSpot = false }) => {
  const [isEditing, setIsEditing] = useState(isNewSpot);
  const { id, address, name, coordinates, description, tags, images, media } =
    spot;

  return (
    <Popup>
      <div>
        <a
          href={getStreetViewLink(coordinates)}
          target="_blank"
          rel="noreferrer"
          className={styles.icon}
        >
          <SiGooglestreetview className={styles.streetView} />
        </a>

        {!isNewSpot && (
          <>
            <button
              className={styles.icon}
              type="button"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? (
                <BiListUl className={styles.list} />
              ) : (
                <BiEditAlt className={styles.edit} />
              )}
            </button>
          </>
        )}

        {address && (
          <div className={styles.spotInfo}>
            <p>{address}</p>
          </div>
        )}

        {!isEditing && (
          <div className={styles.spotInfo}>
            {name && <h3>{name}</h3>}
            {description && <p>{description}</p>}
            {tags.length
              ? tags.map((tag, i) => <Tag tag={tag} key={i} />)
              : null}
            {images.length ? <></> : null} {/*  // TODO - ImageCarousel */}
            {media.length ? <></> : null}
          </div>
        )}

        {isEditing && (
          <EditSpotForm
            id={id}
            isNewSpot={isNewSpot}
            successCb={() => setIsEditing(false)}
          />
        )}
      </div>
    </Popup>
  );
};

export default Tooltip;

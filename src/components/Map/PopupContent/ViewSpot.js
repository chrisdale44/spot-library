import React from "react";
import { useRecoilState } from "recoil";
import { modalState } from "../../../state";
import ViewSpotModal from "../../Modal/ViewSpot";
import { getCloudinaryThumb } from "../../../utils/cloudinary";
import styles from "./PopupContent.module.scss";

const ViewSpot = ({ spot }) => {
  const { id, name, images } = spot;
  const [, setModal] = useRecoilState(modalState);

  const handlePopupClick = () => {
    setModal(<ViewSpotModal spot={spot} />);
  };

  return (
    <div className={styles.popupContainer} onClick={() => handlePopupClick(id)}>
      {images.length ? (
        <img
          loading="lazy"
          decoding="async"
          src={getCloudinaryThumb(images[0].url)}
        />
      ) : null}
      <h3>{name}</h3>
    </div>
  );
};

export default ViewSpot;

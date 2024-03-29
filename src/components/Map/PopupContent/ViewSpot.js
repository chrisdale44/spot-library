import React from "react";
import { useRecoilState } from "recoil";
import { modalState, popupState } from "../../../state";
import ViewSpotModal from "../../Modal/ViewSpot";
import { getCloudinaryThumb } from "../../../utils/cloudinary";
import styles from "./PopupContent.module.scss";

const ViewSpot = ({ spot, scaleFactor }) => {
  const { id, name, images } = spot;
  const [, setModal] = useRecoilState(modalState);
  const [, setPopup] = useRecoilState(popupState);

  const handlePopupClick = () => {
    setModal(<ViewSpotModal spot={spot} scaleFactor={scaleFactor} />);
    setPopup(null);
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

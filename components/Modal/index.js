import React from "react";
import Link from "next/link";
import { IoClose } from "react-icons/io5";
import { GrEdit } from "react-icons/gr";
import { SiGooglemaps } from "react-icons/si";
import { FiExternalLink } from "react-icons/fi";
// import { useDispatch, useSelector } from "react-redux";
// import { getSpot } from "../../selectors";
import { getStreetViewLink } from "../../utils/googlemaps";
import styles from "./Modal.module.scss";

const Modal = () => {
  // const dispatch = useDispatch();
  // const id = useSelector(({ modal }) => modal);
  // const spot = useSelector((state) => getSpot(state, id));
  let id;
  const handleClose = () => {
    // dispatch({
    //   type: "CLOSE_MODAL",
    // });
  };

  return id ? (
    <div className={styles.backdrop} onClick={handleClose}>
      <dialog className={styles.modal}>
        <a
          href={getStreetViewLink(spot.coordinates)}
          target="_blank"
          rel="noreferrer"
        >
          <SiGooglemaps className={styles.googlemaps} />
        </a>
        <Link href={`/spot/${id}`} className={styles.edit} passHref>
          <FiExternalLink />
        </Link>
        <Link href={`/spot/${id}/edit`} className={styles.edit} passHref>
          <GrEdit />
        </Link>
        <button className={styles.close} type="button" onClick={handleClose}>
          <IoClose />
        </button>
        <br />
        <br />
        {spot.name}
      </dialog>
    </div>
  ) : null;
};

export default Modal;

import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { IoClose } from "react-icons/io5";
import Spot from "./Spot";
import { modalState } from "../../state";
import styles from "./Modal.module.scss";

const Modal = () => {
  const [modal, setModal] = useRecoilState(modalState);
  const [modalContent, setModalContent] = useState(null);

  useEffect(() => {
    if (modal) {
      setModalContent(<Spot id={modal.id} />);
    }
  }, [modal]);

  const handleClose = () => {
    setModal(null);
  };

  return modal ? (
    <div className={styles.backdrop} onClick={handleClose}>
      <dialog className={styles.modal}>
        <button className={styles.close} type="button" onClick={handleClose}>
          <IoClose />
        </button>
        {modalContent}
      </dialog>
    </div>
  ) : null;
};

export default Modal;

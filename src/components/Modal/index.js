import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { IoClose } from "react-icons/io5";
import ViewSpot from "./ViewSpot";
import SpotForm from "../Forms/SpotForm";
import { modalState } from "../../state";
import styles from "./Modal.module.scss";

const Modal = () => {
  const [modal, setModal] = useRecoilState(modalState);
  const [modalContent, setModalContent] = useState(null);

  useEffect(() => {
    if (modal) {
      const { id, type } = modal;

      switch (type) {
        case "openSpot":
          setModalContent(<ViewSpot id={id} />);
          break;
        case "newSpot":
          setModalContent(<SpotForm />);
          break;
        case "editSpot":
          setModalContent(<SpotForm id={id} />);
          break;
      }
    }
  }, [modal]);

  const handleClose = () => {
    setModal(null);
    setModalContent(null);
  };

  return modal && modalContent ? (
    <div className={styles.backdrop} onClick={handleClose}>
      <dialog className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} type="button" onClick={handleClose}>
          <IoClose />
        </button>
        {modalContent}
      </dialog>
    </div>
  ) : null;
};

export default Modal;

import React from "react";
import { useRecoilState } from "recoil";
import { IoClose } from "react-icons/io5";
import { modalState } from "../../state";
import styles from "./Modal.module.scss";

const Modal = () => {
  const [modalContent, setModal] = useRecoilState(modalState);

  const handleClose = () => {
    setModal(null);
  };

  return modalContent ? (
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

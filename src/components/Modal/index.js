import React from "react";
import { useRecoilState } from "recoil";
import { IoClose } from "react-icons/io5";
import { modalState } from "../../state";
import styles from "./Modal.module.scss";

const Modal = () => {
  const [modal, setModal] = useRecoilState(modalState);

  const handleClose = () => {
    setModal(null);
  };

  return modal ? (
    <div className={styles.backdrop} onClick={handleClose}>
      <dialog className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} type="button" onClick={handleClose}>
          <IoClose />
        </button>
        {modal}
      </dialog>
    </div>
  ) : null;
};

export default Modal;

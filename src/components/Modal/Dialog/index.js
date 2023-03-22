import React from "react";
import { useRecoilState } from "recoil";
import { modalState } from "../../../state";
import styles from "./Dialog.module.scss";

const Dialog = ({ children, yesCallback, noCallback }) => {
  const [, setModal] = useRecoilState(modalState);
  const handleYes = () => {
    if (yesCallback) yesCallback();
    setModal(null);
  };

  const handleNo = () => {
    if (noCallback) noCallback();
    setModal(null);
  };
  return (
    <div className={styles.wrapper}>
      {children}
      <button onClick={handleYes}>Yes</button>
      <button onClick={handleNo}>No</button>
    </div>
  );
};

export default Dialog;

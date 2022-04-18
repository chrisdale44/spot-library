import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import classNames from "classnames";
import { toastState } from "../../state";
import styles from "./Toast.module.scss";

let cx = classNames.bind(styles);

const Toast = () => {
  const [toast, setToast] = useRecoilState(toastState);

  useEffect(() => {
    if (toast) {
      setTimeout(() => {
        setToast(false);
      }, 3000);
    }
  }, [toast]);

  return toast ? (
    <div className={cx(styles.toast, styles[toast.type])}>{toast.message}</div>
  ) : null;
};

// Toast.prototypes = {
//   toast: PropTypes.shape({
//     type: PropTypes.oneOf(["success", "warning", "error", "info"]),
//     message: PropTypes.string,
//   }),
// };

export default Toast;

import React, { useEffect } from "react";
// import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import classNames from "classnames";
import styles from "./Toast.module.scss";

let cx = classNames.bind(styles);

const Toast = ({ toast }) => {
  useEffect(() => {
    if (toast) {
      setTimeout(() => {
        // dispatch({
        //   type: "HIDE_TOAST",
        // });
      }, 3000);
    }
  }, [toast]);

  return toast ? (
    <div className={cx(styles.toast, styles[toast.type])}>{toast.message}</div>
  ) : null;
};

Toast.prototypes = {
  toast: PropTypes.shape({
    type: PropTypes.oneOf(["success", "warning", "error", "info"]),
    message: PropTypes.string,
  }),
};

export default Toast;

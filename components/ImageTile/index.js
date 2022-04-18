import React from "react";
import Image from "next/image";
import classNames from "classnames";
let cx = classNames.bind(styles);

import styles from "./LazyImage.module.scss";

const LazyImage = ({
  width,
  height,
  src,
  wrapperClassname,
  topRightIcon,
  topRightIconOnClick,
  id,
  ...rest
}) => {
  return (
    <div className={cx(styles.wrapper, wrapperClassname)}>
      <Image
        src={src}
        alt="alt"
        width={200}
        height={200}
        loading="lazy"
        {...rest}
      />
      {topRightIcon && topRightIconOnClick && (
        <button
          className={styles.icon}
          type="button"
          onClick={() => topRightIconOnClick(id)}
        >
          {topRightIcon}
        </button>
      )}
    </div>
  );
};

export default LazyImage;

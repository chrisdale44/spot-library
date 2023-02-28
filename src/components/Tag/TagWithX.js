import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { IoClose } from "react-icons/io5";
import styles from "./Tag.module.scss";
let cx = classNames.bind(styles);

const TagWithX = ({ tag, onDelete }) => (
  <div className={cx(styles.tag, styles.withX)}>
    {tag.name}
    <button
      className={styles.close}
      type="button"
      onClick={() => onDelete(tag.id)}
    >
      <IoClose />
    </button>
  </div>
);

TagWithX.prototypes = {
  tag: PropTypes.shape({
    id: PropTypes.string.required,
    name: PropTypes.string.isRequired,
  }),
  onDelete: PropTypes.func.isRequired,
};

export default TagWithX;

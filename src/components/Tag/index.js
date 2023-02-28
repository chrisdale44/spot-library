import React, { useState } from "react";
// import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import classNames from "classnames";
import styles from "./Tag.module.scss";
let cx = classNames.bind(styles);

const Tag = ({ tag }) => {
  // const dispatch = useDispatch();
  const [selected, setSelected] = useState(false);
  const handleClick = (id) => {
    if (selected) {
      // dispatch({
      //   type: "DESELECT_TAG",
      //   payload: id,
      // });
    } else {
      // dispatch({
      //   type: "SELECT_TAG",
      //   payload: id,
      // });
    }
    setSelected(!selected);
  };

  return (
    <button
      type="button"
      className={cx(styles.tag, { [styles.selected]: selected })}
      onClick={() => handleClick(tag.id)}
    >
      {tag.name}
    </button>
  );
};

Tag.prototypes = {
  tag: PropTypes.shape({
    id: PropTypes.string.required,
    name: PropTypes.string.isRequired,
  }),
};

export default Tag;

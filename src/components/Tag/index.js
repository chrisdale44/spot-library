import React, { useState } from "react";
import useTagActions from "../../state/tags/actions";
import PropTypes from "prop-types";
import classNames from "classnames";
import styles from "./Tag.module.scss";
let cx = classNames.bind(styles);

const Tag = ({ tag }) => {
  const { selectTag, deselectTag } = useTagActions();
  const [selected, setSelected] = useState(false);
  const handleClick = (id) => {
    if (selected) {
      deselectTag(id);
    } else {
      selectTag(id);
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

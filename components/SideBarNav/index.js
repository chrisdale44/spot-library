import React from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { useHistory } from "react-router-dom";
import { MdImage, MdBrokenImage } from "react-icons/md";
import classNames from "classnames";
import Tag from "../Tag/";
import ComboBox from "../ComboBox";
import styles from "./SideBarNav.module.scss";
let cx = classNames.bind(styles);

const SideBarNav = ({ sidebarOpen }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const tags = useSelector(({ tags }) => tags);
  const spots = useSelector(({ spots }) => spots);
  const filterValue = useSelector(({ filterValue }) => filterValue);
  const spotNames = spots.map(({ id, name }) => ({
    id,
    name: name ? name : "",
  }));

  const handleSelection = ({ id, name }) => {
    if (id) history.push(`/spot/${id}/edit`);
    if (name) {
      dispatch({
        type: "FILTER_SPOTS_BY_TITLE",
        payload: name,
      });
    }
  };

  const handleClear = () => {
    dispatch({
      type: "CLEAR_FILTER_SPOTS",
    });
  };

  const filterWithImages = () => {
    dispatch({
      type: "FILTER_SPOTS_WITH_IMG",
    });
  };

  const filterWithoutImages = () => {
    dispatch({
      type: "FILTER_SPOTS_WITHOUT_IMG",
    });
  };

  return (
    <nav className={cx(styles.navBar, { [styles.open]: sidebarOpen })}>
      <div>
        <button
          type="button"
          className={styles.withImages}
          onClick={filterWithImages}
        >
          <MdImage />
        </button>
        <button
          type="button"
          className={styles.withoutImages}
          onClick={filterWithoutImages}
        >
          <MdBrokenImage />
        </button>
        <button type="button" className={styles.clear} onClick={handleClear}>
          Clear All
        </button>
      </div>
      <ComboBox
        allOptions={spotNames}
        onSelection={handleSelection}
        onClear={handleClear}
      />
      {tags && tags.map((tag, i) => <Tag tag={tag} key={i} />)}
    </nav>
  );
};

export default SideBarNav;

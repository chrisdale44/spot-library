import React from "react";
import { useRecoilState } from "recoil";
import { MdImage, MdBrokenImage } from "react-icons/md";
import classNames from "classnames";
import Tag from "../Tag/";
import ComboBox from "../ComboBox";
import FilterToggle from "../FilterToggle";
import { tagsState } from "../../state";
import useFilterActions from "../../state/filters/actions";
import styles from "./SideBarNav.module.scss";
let cx = classNames.bind(styles);

const SideBarNav = ({ sidebarOpen, filteredSpots }) => {
  const [tags] = useRecoilState(tagsState);
  const spotNames = filteredSpots?.map(({ id, name }) => ({
    id,
    name: name ? name : "",
  }));
  const { selectFilter, deselectFilter, clearFilters } = useFilterActions();

  const handleSelection = (payload) => {
    selectFilter({ id: "searchFilter", payload });
  };

  const handleSearchClear = () => {
    deselectFilter({ id: "searchFilter" });
  };

  return (
    <nav className={cx(styles.navBar, { [styles.open]: sidebarOpen })}>
      <div>
        <FilterToggle id="imagesToggle">
          <MdImage />
        </FilterToggle>
        <FilterToggle id="noImagesToggle">
          <MdBrokenImage />
        </FilterToggle>
        <button type="button" className={styles.clear} onClick={clearFilters}>
          Clear Filters
        </button>
      </div>
      <ComboBox
        allOptions={spotNames}
        onSelection={handleSelection}
        onClear={handleSearchClear}
        onSubmit={() => {}}
        placeholder="Search spots"
      />
      {tags && tags.map((tag, i) => <Tag tag={tag} key={i} />)}
    </nav>
  );
};

export default SideBarNav;

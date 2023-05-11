import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import { MdImage, MdBrokenImage } from "react-icons/md";
import classNames from "classnames";
import Tag from "../Tag/";
import ComboBox from "../ComboBox";
import FilterToggle from "../FilterToggle";
import {
  selectedFiltersState,
  tagsState,
  filteredSpotsState,
  spotsState,
} from "../../state";
import useFilterActions from "../../state/filters/actions";
import { filterSpots } from "../../state/filters/utils";
import styles from "./SideBarNav.module.scss";
import tagStyles from "../Tag/Tag.module.scss";
let cx = classNames.bind(styles);

const SideBarNav = ({ sidebarOpen }) => {
  const [tags] = useRecoilState(tagsState);
  const [spots] = useRecoilState(spotsState);
  const [filteredSpots, setFilteredSpots] = useRecoilState(filteredSpotsState);
  const [selectedFilters] = useRecoilState(selectedFiltersState);
  const { selectFilter, deselectFilter, clearFilters } = useFilterActions();

  const spotNames = filteredSpots?.map(({ id, name }) => ({
    id,
    name: name ? name : "",
  }));

  const handleSelection = (payload) => {
    selectFilter({ id: "searchFilter", payload });
  };

  const handleSearchClear = () => {
    deselectFilter({ id: "searchFilter" });
  };

  useEffect(() => {
    setFilteredSpots(filterSpots(spots, selectedFilters));
  }, [selectedFilters]);

  return (
    <nav className={cx(styles.navBar, { [styles.open]: sidebarOpen })}>
      <span className={styles.filterStatus}>
        Showing {filteredSpots.length} of {spots.length} spots
      </span>
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
      <div className={tagStyles.tagsWrapper}>
        {tags && tags.map((tag, i) => <Tag tag={tag} key={i} />)}
      </div>
    </nav>
  );
};

export default SideBarNav;

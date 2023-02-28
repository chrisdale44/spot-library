import React from "react";
import { useRecoilState } from "recoil";
import { selectedFiltersState } from "../../state";
import useFilterActions from "../../state/filters/actions";
import styles from "./FilterToggle.module.scss";
import classNames from "classnames";
let cx = classNames.bind(styles);

const FilterToggle = ({ children, id }) => {
  const [selectedFilters] = useRecoilState(selectedFiltersState);
  const { selectFilter, deselectFilter } = useFilterActions();

  const selected = selectedFilters.some((filter) => filter.id === id);

  return (
    <button
      type="button"
      className={cx(styles.filterToggle, { [styles.selected]: selected })}
      onClick={() => {
        if (selected) {
          deselectFilter({ id });
        } else {
          selectFilter({ id });
        }
      }}
    >
      {children}
    </button>
  );
};

export default FilterToggle;

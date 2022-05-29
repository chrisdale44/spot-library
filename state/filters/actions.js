import { useRecoilState } from "recoil";
import { selectedFiltersState } from "./";

const useFilterActions = () => {
  const [selectedFilters, setSelectedFilters] =
    useRecoilState(selectedFiltersState);

  const clearFilters = () => {
    setSelectedFilters([]);
  };

  const selectFilter = ({ id, payload }) => {
    setSelectedFilters([...selectedFilters, { id, payload }]);
  };

  const deselectFilter = ({ id }) => {
    setSelectedFilters(selectedFilters.filter((filter) => filter.id !== id));
  };

  return {
    selectFilter,
    deselectFilter,
    clearFilters,
  };
};

export default useFilterActions;

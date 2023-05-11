import { useRecoilState } from "recoil";
import { selectedFiltersState } from "./";

const useFilterActions = () => {
  const [selectedFilters, setSelectedFilters] =
    useRecoilState(selectedFiltersState);

  const clearFilters = () => {
    setSelectedFilters([]);
  };

  const selectFilter = ({ id, payload }) => {
    const existingFilter = selectedFilters.find(
      ({ id: filterId }) => filterId === id
    );

    if (existingFilter) {
      setSelectedFilters(
        selectedFilters.map((filter) =>
          filter.id === id ? { id, payload } : filter
        )
      );
    } else {
      setSelectedFilters([...selectedFilters, { id, payload }]);
    }
  };

  const deselectFilter = ({ id, payload }) => {
    setSelectedFilters(selectedFilters.filter((filter) => filter.id !== id));
  };

  return {
    selectFilter,
    deselectFilter,
    clearFilters,
  };
};

export default useFilterActions;

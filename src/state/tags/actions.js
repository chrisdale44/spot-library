import { useRecoilState } from "recoil";
import { selectedFiltersState } from "../filters";
import useFilterActions from "../filters/actions";

const useTagActions = () => {
  const { selectFilter } = useFilterActions();
  const [selectedFilters] = useRecoilState(selectedFiltersState);
  const selectedTags = selectedFilters.find(({ id }) => id === "selectedTags");
  const selectedTagsPayload = selectedTags?.payload || [];

  const selectTag = (payload) => {
    selectFilter({
      id: "selectedTags",
      payload: [...selectedTagsPayload, payload],
    });
  };

  const deselectTag = (payload) => {
    selectFilter({
      id: "selectedTags",
      payload: selectedTagsPayload.filter((id) => id !== payload),
    });
  };

  return { selectTag, deselectTag };
};

export default useTagActions;

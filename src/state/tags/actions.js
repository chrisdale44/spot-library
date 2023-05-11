import { useRecoilState } from "recoil";
import { selectedTagsState } from "./";

const useTagActions = () => {
  const [selectedTags, setSelectedTags] = useRecoilState(selectedTagsState);

  const selectTag = (payload) => {
    setSelectedTags([...selectedTags, payload]);
  };

  const deselectTag = (payload) => {
    setSelectedTags(selectedTags.filter((id) => id !== payload));
  };

  return { selectTag, deselectTag };
};

export default useTagActions;

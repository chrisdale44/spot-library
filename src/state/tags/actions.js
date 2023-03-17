import { useRecoilState } from "recoil";
import { tagsState } from "./";

const useTagActions = () => {
  const [tags, setTags] = useRecoilState(tagsState);

  const selectTag = (payload) => {
    setTags([...tags, payload]);
  };

  const deselectTag = (payload) => {
    setTags(tags.filter((id) => id !== payload));
  };

  return { selectTag, deselectTag };
};

export default useTagActions;

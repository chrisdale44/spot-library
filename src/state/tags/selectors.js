import { useRecoilState } from "recoil";

const useTagSelectors = () => {
  const [tags] = useRecoilState(tagsState);

  const getTag = (id) => tags.find((tag) => tag.id === id);

  return {
    getTag,
  };
};

export default useTagSelectors;

import { useRecoilState } from "recoil";

const [tags] = useRecoilState(tagsState);
const getTag = tags.find((tag) => tag.id === id);

export { getTag };

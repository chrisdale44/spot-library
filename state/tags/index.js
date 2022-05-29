import { atom } from "recoil";

const tagsState = atom({
  key: "tagsState",
  default: [],
});

const selectedTagsState = atom({
  key: "selectedTagsState",
  default: [],
});

export { tagsState, selectedTagsState };

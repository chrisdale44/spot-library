import { atom } from "recoil";

const tagsState = atom({
  key: "tagsState",
  default: [],
});

export { tagsState };

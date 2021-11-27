import { atom, selector } from "recoil";

const spotsState = atom({
  key: "spotsState",
  default: [],
});

export { spotsState };

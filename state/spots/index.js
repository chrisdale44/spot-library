import { atom } from "recoil";

const spotsState = atom({
  key: "spotsState",
  default: [],
});

export { spotsState };

import { atom } from "recoil";

const spotsState = atom({
  key: "spotsState",
  default: [],
});

const filteredSpotsState = atom({
  key: "filteredSpotsState",
  default: [],
});

export { spotsState, filteredSpotsState };

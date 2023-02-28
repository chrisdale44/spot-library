import { atom } from "recoil";

const selectedFiltersState = atom({
  key: "selectedFiltersState",
  default: [],
});

export { selectedFiltersState };

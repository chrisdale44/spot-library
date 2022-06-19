import { atom } from "recoil";

const navState = atom({
  key: "navState",
  default: "map",
});

export { navState };

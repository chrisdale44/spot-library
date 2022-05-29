import { atom } from "recoil";

const navState = atom({
  key: "navState",
  default: "grid",
});

export { navState };

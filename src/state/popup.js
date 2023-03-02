import { atom } from "recoil";

const popupState = atom({
  key: "popupState",
  default: false,
});

export { popupState };

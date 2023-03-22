import { atom } from "recoil";

const toastState = atom({
  key: "toastState",
  default: false,
});

export { toastState };

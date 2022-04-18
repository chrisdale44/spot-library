import { atom, selector } from "recoil";

const toastState = atom({
  key: "toastState",
  default: false,
});

export { toastState };

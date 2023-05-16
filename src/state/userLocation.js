import { atom } from "recoil";

const userLocationState = atom({
  key: "userLocationState",
  default: false,
});

export { userLocationState };

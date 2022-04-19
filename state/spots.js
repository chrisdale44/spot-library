import { atom, selectorFamily } from "recoil";

const spotsState = atom({
  key: "spotsState",
  default: [],
});

const getSpot = selectorFamily({
  key: "getSpot",
  get:
    (id) =>
    ({ get }) => {
      const spots = get(spotsState);
      return spots.find((spot) => spot.id === id);
    },
});

export { spotsState, getSpot };

import { useRecoilState } from "recoil";
import { spotsState } from "./";

const useSpotSelectors = () => {
  const [spots] = useRecoilState(spotsState);

  const getSpot = (id) => spots.find((spot) => spot.id === id);

  return {
    getSpot,
  };
};

export default useSpotSelectors;

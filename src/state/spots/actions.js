import { useRecoilState } from "recoil";
import { spotsState } from "./";
import { parseSpot } from "./utils";

const useSpotActions = () => {
  const [spots, setSpots] = useRecoilState(spotsState);

  const addSpot = (payload) => {
    setSpots([...spots, payload]);
  };

  const updateSpot = (payload) => {
    const parsedSpot = parseSpot(payload);
    setSpots(spots.map((spot) => (spot.id === payload.id ? parsedSpot : spot)));
  };

  const deleteSpot = (payload) => {
    setSpots(spots.filter((spots) => spots.id !== payload));
  };

  return {
    addSpot,
    updateSpot,
    deleteSpot,
  };
};

export default useSpotActions;

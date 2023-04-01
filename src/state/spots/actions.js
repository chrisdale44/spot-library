import { useRecoilState } from "recoil";
import { spotsState } from "./";

const useSpotActions = () => {
  const [spots, setSpots] = useRecoilState(spotsState);

  const addSpot = (payload) => {
    setSpots([...spots, payload]);
  };

  const updateSpot = (payload) => {
    setSpots(spots.map((spot) => (spot.id === payload.id ? payload : spot)));
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

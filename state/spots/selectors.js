import { useRecoilState } from "recoil";
import { spotsState } from "./";

const [spots] = useRecoilState(spotsState);
const getSpot = spots.find((spot) => spot.id === id);

export { getSpot };

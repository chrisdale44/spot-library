import React from "react";
import Control from "react-leaflet-custom-control";
import { useRecoilState } from "recoil";
import { RiMapPinAddFill } from "react-icons/ri";
import { mapState as mapRecoilState } from "../../../../../state";

const AddNewSpot = () => {
  const [mapState, setMapState] = useRecoilState(mapRecoilState);

  const createNewSpot = (e) => {
    const nextState = mapState?.id === "addSpot" ? null : { id: "addSpot" };
    setMapState(nextState);
  };

  return (
    <Control position="topleft">
      <button type="button" onClick={createNewSpot}>
        <RiMapPinAddFill />
      </button>
    </Control>
  );
};

export default AddNewSpot;

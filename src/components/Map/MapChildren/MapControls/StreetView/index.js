import React from "react";
import Control from "react-leaflet-custom-control";
import { useRecoilState } from "recoil";
import { GrStreetView } from "react-icons/gr";
import { mapState as mapRecoilState } from "../../../../../state";

const StreetView = () => {
  const [mapState, setMapState] = useRecoilState(mapRecoilState);

  const toggleStreetViewCursor = (e) => {
    const nextState =
      mapState?.id === "streetViewCursor" ? null : { id: "streetViewCursor" };
    setMapState(nextState);
  };

  return (
    <Control position="topleft">
      <button onClick={toggleStreetViewCursor}>
        <GrStreetView />
      </button>
    </Control>
  );
};

export default StreetView;

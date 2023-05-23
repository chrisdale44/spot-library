import React, { useContext } from "react";
import { useRecoilState } from "recoil";
import UserLocationIcon from "../UserLocationIcon";
import MarkersOverlay from "../MarkersOverlay";
import StreetViewCursor from "../StreetViewCursor";
import SearchField from "./MapControls/SearchField";
import { PixiContext } from "../../../utils/middleware/ReactLeafletReactPixi";
import { calcScaleFactor } from "../../../utils/calcScaleFactor";
import { mapState as mapRecoilState } from "../../../state";

const MapChildren = ({ spots }) => {
  const [mapState] = useRecoilState(mapRecoilState);
  const { scale } = useContext(PixiContext);

  const scaleFactor = calcScaleFactor(scale);

  return (
    <>
      <MarkersOverlay spots={spots} scaleFactor={scaleFactor} />
      {mapState?.id === "streetViewCursor" ? (
        <StreetViewCursor scaleFactor={scaleFactor} />
      ) : null}
      <UserLocationIcon scaleFactor={scaleFactor} />
      <SearchField />
    </>
  );
};

export default MapChildren;

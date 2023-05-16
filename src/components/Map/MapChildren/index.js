import React, { useContext } from "react";
import { useRecoilState } from "recoil";
import UserLocation from "../UserLocation";
import SearchField from "../SearchField";
import MarkersOverlay from "../MarkersOverlay";
import StreetViewCursor from "../StreetViewCursor";
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
      <UserLocation scaleFactor={scaleFactor} />
      <SearchField />
    </>
  );
};

export default MapChildren;

import React, { useState, useEffect, useContext } from "react";
import { useRecoilState } from "recoil";
import { Sprite } from "@pixi/react";
import { PixiContext } from "../../../utils/middleware/ReactLeafletReactPixi";
import { getCrosshairsIcon, calcOffset } from "../utils";
import { userLocationState } from "../../../state";

const UserLocation = ({ scaleFactor }) => {
  const [userLocation] = useRecoilState(userLocationState);
  const { map, scale, latLngToLayerPoint } = useContext(PixiContext);
  const [userLocationLayerPoint, setUserLocationLayerPoint] = useState();

  useEffect(() => {
    console.log(userLocation);
    if (userLocation) {
      map.flyTo(userLocation, 16);
      const layerPoint = latLngToLayerPoint(userLocation);
      console.log(layerPoint);
      setUserLocationLayerPoint(layerPoint);
    } else {
      setUserLocationLayerPoint(null);
    }
  }, [userLocation]);

  return (
    userLocationLayerPoint && (
      <Sprite
        anchor={[0.5, 0.5]}
        offset={[0, calcOffset(scaleFactor)]}
        image={getCrosshairsIcon("#13F7F3")}
        x={userLocationLayerPoint.x}
        y={userLocationLayerPoint.y}
        scale={scaleFactor / scale}
      />
    )
  );
};

export default UserLocation;

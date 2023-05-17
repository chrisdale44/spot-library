import React, { useState, useEffect, useContext } from "react";
import { useRecoilState } from "recoil";
import { PixiContext } from "../../../utils/middleware/ReactLeafletReactPixi";
import { mapState as mapRecoilState } from "../../../state";
import { Sprite } from "@pixi/react";
import { getStreetViewIcon } from "../utils";
import { getStreetViewLink } from "../../../utils/googlemaps";

const StreetViewCursor = ({ scaleFactor }) => {
  const { map, scale, latLngToLayerPoint } = useContext(PixiContext);
  const [, setMapState] = useRecoilState(mapRecoilState);
  const [cursorLayerPoint, setCursorLayerPoint] = useState();

  useEffect(() => {
    map.on("mousemove", handleMouseMove);
    map.on("click", handleMapClick);
    map.on("tap", handleMapClick);
    map.on("keydown", handleKeyDown);

    return () => {
      cleanup();
    };
  }, []);

  const cleanup = () => {
    map.off("click");
    map.off("tap");
    map.off("mousemove");
    map.off("keydown");
    setMapState(null);
  };

  const handleMouseMove = (e) => {
    setCursorLayerPoint(latLngToLayerPoint(e.latlng));
  };

  const handleMapClick = (e) => {
    const streetViewUrl = getStreetViewLink([e.latlng.lat, e.latlng.lng]);
    window.open(streetViewUrl, "_blank").focus();
    cleanup();
  };

  const handleKeyDown = (event) => {
    // todo: Why does this only work after clicking the map?
    const e = event.originalEvent;
    if (e.key === "Escape" || e.key === "Esc" || e.keyCode === 27) {
      cleanup();
    }
  };

  const defaultSpriteProps = {
    anchor: [0.7, 1.1],
  };

  return cursorLayerPoint ? (
    <Sprite
      {...defaultSpriteProps}
      image={getStreetViewIcon("#00cc00")}
      x={cursorLayerPoint.x}
      y={cursorLayerPoint.y}
      scale={scaleFactor / scale}
    />
  ) : null;
};

export default StreetViewCursor;

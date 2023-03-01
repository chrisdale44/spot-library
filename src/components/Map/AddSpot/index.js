import React, { useState, useContext, useRef } from "react";
import { Sprite } from "@pixi/react";
import { PixiContext } from "../../../utils/middleware/ReactLeafletReactPixi";
import { getDefaultIcon } from "../utils";

const AddSpot = () => {
  const { getMap, scale, latLngToLayerPoint } = useContext(PixiContext);
  const [spotAlpha, setSpotAlpha] = useState(1);
  const [spotCoords, setSpotCoords] = useState();

  const map = getMap();
  map.on("click", (e) => {
    setSpotCoords(latLngToLayerPoint(e.latlng));
  });

  const handleDragStart = () => {
    map.dragging.disable();
    map.on("mousemove", (e) => {
      setSpotCoords(latLngToLayerPoint(e.latlng));
    });
    setSpotAlpha(0.7);
  };

  const handleDragEnd = () => {
    map.off("mousemove");
    map.dragging.enable();
    setSpotAlpha(1);
  };

  return spotCoords ? (
    <Sprite
      image={getDefaultIcon("#00cc00")}
      x={spotCoords.x}
      y={spotCoords.y}
      anchor={[0.5, 1]}
      alpha={spotAlpha}
      scale={1 / scale}
      interactive
      buttonMode
      pointerdown={handleDragStart}
      pointerup={handleDragEnd}
      pointerupoutside={handleDragEnd}
    />
  ) : null;
};

export default AddSpot;

import React, { useState, useContext } from "react";
import { useRecoilState } from "recoil";
import { Sprite } from "@pixi/react";
import { renderToString } from "react-dom/server";
import { PixiContext } from "../../../utils/middleware/ReactLeafletReactPixi";
import { mapState as mapRecoilState } from "../../../state";
import { getDefaultIcon } from "../utils";
import styles from "./AddSpot.module.scss";

const AddSpot = () => {
  const { getMap, scale, latLngToLayerPoint } = useContext(PixiContext);
  const [spotAlpha, setSpotAlpha] = useState(1);
  const [spotLayerPoint, setSpotLayerPoint] = useState();
  const [mapState, setMapState] = useRecoilState(mapRecoilState);

  const popupHtml = L.DomUtil.create("div", "content");
  popupHtml.innerHTML = renderToString(
    <div className={styles.popupContainer}>
      <h3>Create new spot</h3>
      <input />
      <input />
    </div>
  );

  const popup = L.popup({
    offset: [0, -28],
    closeOnClick: true,
    closeCallback: () => {
      setMapState("default");
      map.off("click");
    },
  }).setContent(popupHtml);

  const map = getMap();
  map.on("click", (e) => {
    setSpotLayerPoint(latLngToLayerPoint(e.latlng));
    map.openPopup(popup.setLatLng([e.latlng.lat, e.latlng.lng]));
  });

  const handleDragStart = () => {
    map.dragging.disable();
    map.closePopup();
    map.on("mousemove", (e) => {
      setSpotLayerPoint(latLngToLayerPoint(e.latlng));
    });
    setSpotAlpha(0.7);
  };

  const handleDragEnd = () => {
    map.off("mousemove");
    map.dragging.enable();
    setSpotAlpha(1);
  };

  return spotLayerPoint ? (
    <Sprite
      image={getDefaultIcon("#00cc00")}
      x={spotLayerPoint.x}
      y={spotLayerPoint.y}
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

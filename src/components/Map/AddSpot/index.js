import React, { useState, useContext, useEffect, useRef } from "react";
import { useRecoilState } from "recoil";
import { Sprite } from "@pixi/react";
import SpotForm from "../../Forms/SpotForm";
import { PixiContext } from "../../../utils/middleware/ReactLeafletReactPixi";
import { mapState as mapRecoilState, popupState } from "../../../state";
import { getDefaultIcon } from "../utils";

const AddSpot = () => {
  const { map, scale, latLngToLayerPoint } = useContext(PixiContext);
  const [spotAlpha, setSpotAlpha] = useState(1);
  const [spotLayerPoint, setSpotLayerPoint] = useState();
  const [, setMapState] = useRecoilState(mapRecoilState);
  const [, setPopup] = useRecoilState(popupState);
  const stateRef = useRef();

  const relocatePin = (latLng) => {
    setSpotLayerPoint(latLngToLayerPoint(latLng));
    setPopup({
      ...stateRef.popup,
      position: [latLng.lat, latLng.lng],
    });
  };

  const exitAddSpot = () => {
    setPopup(null);
    map.off("click");
    map.off("mousemove");
    setMapState("default");
    map.state = null;
  };

  const popupProps = {
    closeCallback: () => {
      exitAddSpot();
    },
  };

  useEffect(() => {
    // used for determining popup panning function
    map.state = "addSpot";

    map.on("click", (e) => {
      setSpotLayerPoint(latLngToLayerPoint(e.latlng));
      stateRef.popup = {
        props: popupProps,
        position: [e.latlng.lat, e.latlng.lng],
        content: <SpotForm latlng={e.latlng} relocatePin={relocatePin} />,
      };
      setPopup(stateRef.popup);
    });

    // todo: Why does this only work after clicking the map?
    map.on("keydown", (event) => {
      const e = event.originalEvent;
      if (e.key === "Escape" || e.key === "Esc" || e.keyCode === 27) {
        exitAddSpot();
      }
    });

    return function cleanup() {
      exitAddSpot();
    };
  }, []);

  const handleDragStart = () => {
    map.dragging.disable();
    map.closePopup(null, true);
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

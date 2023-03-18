import React, { useState, useContext, useEffect } from "react";
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

  useEffect(() => {
    return function cleanup() {
      // remove event listener on component unmount
      map.off("click");
    };
  }, []);

  const defaultPopupOptions = {
    offset: [0, -28],
    closeOnClick: true,
    closeCallback: () => {
      setMapState("default");
      map.off("click");
    },
  };

  const exitAddSpot = () => {
    map.off("mousemove");
    map.dragging.enable();
    setSpotAlpha(1);
  };

  map.on("click", (e) => {
    setSpotLayerPoint(latLngToLayerPoint(e.latlng));
    setPopup({
      props: { ...defaultPopupOptions },
      position: [e.latlng.lat, e.latlng.lng],
      content: <SpotForm />,
    });
  });

  // Why this only works after clicking the map?
  map.on("keydown", (event) => {
    const e = event.originalEvent;
    if (e.key === "Escape" || e.key === "Esc" || e.keyCode === 27) {
      exitAddSpot();
    }
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
    exitAddSpot();
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

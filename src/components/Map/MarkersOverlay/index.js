import React, { useState, useContext, useEffect, useRef, useMemo } from "react";
import { useRecoilState } from "recoil";
import { Sprite } from "@pixi/react";
import ViewSpot from "../../Modal/ViewSpot";
import { getDefaultIcon } from "../utils";
import { modalState, popupState } from "../../../state";
import { PixiContext } from "../../../utils/middleware/ReactLeafletReactPixi";
import { calcScaleFactor } from "../../../utils/calcScaleFactor";
import generateMarkersWithPopup from "./generateMarkersWithPopup";

const MarkersOverlay = ({ spots }) => {
  const [, setPopup] = useRecoilState(popupState);
  const [markers, setMarkers] = useState([]);
  const [, setModal] = useRecoilState(modalState);
  const { latLngToLayerPoint, scale } = useContext(PixiContext);
  const stateRef = useRef();

  stateRef.scaleFactor = useMemo(() => calcScaleFactor(scale), [scale]);

  const handleDragStart = (e) => {
    stateRef.dragStart = { ...e.global };
  };

  const handleDragEnd = (e) => {
    if (!stateRef.dragStart) return;

    const clickSensitivity = 10;
    if (
      stateRef.dragStart.x > e.global.x + clickSensitivity ||
      stateRef.dragStart.x < e.global.x - clickSensitivity ||
      stateRef.dragStart.y > e.global.y + clickSensitivity ||
      stateRef.dragStart.y < e.global.y - clickSensitivity
    ) {
      stateRef.markerWasDragged = true;
    }
  };

  const markerClickHandler = (coordinates, popupContent) => {
    const markerHeight = 36;
    const fixedOffset = 10;
    const markerYOffset = -(stateRef.scaleFactor * markerHeight - fixedOffset);

    // todo: is it possible to update offset on zoom?

    if (!stateRef.markerWasDragged) {
      setPopup({
        props: {
          offset: [0, markerYOffset],
          closeOnClick: true,
          closeCallback: () => {
            setPopup(null);
          },
        },
        position: coordinates,
        content: popupContent,
      });
    }
    stateRef.markerWasDragged = false;
    stateRef.dragStart = null;
  };

  const popupClickHandler = (id) => {
    setModal(<ViewSpot id={id} />);
  };

  useEffect(() => {
    setMarkers(
      generateMarkersWithPopup(spots, markerClickHandler, popupClickHandler)
    );
  }, [spots]);

  return (
    <>
      {markers.length && latLngToLayerPoint
        ? markers.map((marker, i) => {
            const { x, y } = latLngToLayerPoint(marker.coordinates);
            return (
              <Sprite
                key={i}
                x={x}
                y={y}
                scale={stateRef.scaleFactor / scale}
                anchor={[0.5, 1]}
                image={getDefaultIcon(marker.iconColor)}
                pointerdown={handleDragStart}
                pointerup={handleDragEnd}
                pointerupoutside={handleDragEnd}
                {...marker}
              />
            );
          })
        : null}
    </>
  );
};

export default MarkersOverlay;

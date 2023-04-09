import React, { useContext, useRef } from "react";
import { useRecoilState } from "recoil";
import { Sprite } from "@pixi/react";
import ViewSpot from "../PopupContent/ViewSpot";
import { PixiContext } from "../../../utils/middleware/ReactLeafletReactPixi";
import { popupState } from "../../../state";
import { getDefaultIcon, calcOffset, getPopupClassNames } from "../utils";

const Marker = ({ x, y, scaleFactor, iconColor, spot, ...props }) => {
  const { coordinates } = spot;
  const { scale } = useContext(PixiContext);
  const [, setPopup] = useRecoilState(popupState);
  const stateRef = useRef();

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

  const handleClick = () => {
    if (!stateRef.markerWasDragged) {
      setPopup({
        props: {
          offset: [0, calcOffset(scaleFactor)],
          className: getPopupClassNames(spot),
        },
        position: coordinates,
        content: <ViewSpot spot={spot} scaleFactor={scaleFactor} />,
      });
    }
    stateRef.markerWasDragged = false;
    stateRef.dragStart = null;
  };

  const defaultSpriteProps = {
    interactive: true,
    buttonMode: true,
    anchor: [0.5, 1],
  };

  const eventHandlers = {
    pointerdown: handleDragStart,
    pointerup: handleDragEnd,
    pointerupoutside: handleDragEnd,
    click: handleClick,
    tap: handleClick,
  };

  return x && y ? (
    <Sprite
      {...defaultSpriteProps}
      {...eventHandlers}
      image={getDefaultIcon(iconColor)}
      x={x}
      y={y}
      scale={scaleFactor / scale}
      {...props}
    />
  ) : null;
};

export default Marker;

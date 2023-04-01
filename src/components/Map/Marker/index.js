import React, { useState, useContext, useEffect, useRef, useMemo } from "react";
import { useRecoilState } from "recoil";
import classNames from "classnames";
import { Sprite } from "@pixi/react";
import ViewSpot from "../PopupContent/ViewSpot";
import { PixiContext } from "../../../utils/middleware/ReactLeafletReactPixi";
import { popupState } from "../../../state";
import { getDefaultIcon, calcOffset } from "../utils";
import styles from "../PopupContent/PopupContent.module.scss";

let cx = classNames.bind(styles);

const Marker = ({ x, y, scaleFactor, iconColor, spot, ...props }) => {
  const { coordinates, images } = spot;
  const { scale } = useContext(PixiContext);
  const [, setPopup] = useRecoilState(popupState);
  const [popupClassName, setPopupClassName] = useState("");
  const stateRef = useRef();

  useEffect(() => {
    if (Object.keys(spot).length) {
      const hasImages = !!images.length;
      setPopupClassName(
        cx({
          "has-images": hasImages,
          [styles.hasImages]: hasImages,
        })
      );
    }
  }, [spot, images]);

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
          closeOnClick: true,
          closeCallback: () => {
            setPopup(null);
          },
          className: popupClassName,
        },
        position: coordinates,
        content: <ViewSpot spot={spot} scaleFactor={scaleFactor} />,
      });
    }
    stateRef.markerWasDragged = false;
    stateRef.dragStart = null;
  };

  const defaultProps = {
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
      {...defaultProps}
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

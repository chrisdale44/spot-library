import React, { useState, useContext, useEffect, useRef } from "react";
import { useRecoilState } from "recoil";
import classNames from "classnames";
import { Sprite } from "@pixi/react";
import SpotForm from "../../Forms/SpotForm";
import ViewSpot from "../PopupContent/ViewSpot";
import { PixiContext } from "../../../utils/middleware/ReactLeafletReactPixi";
import { mapState as mapRecoilState, popupState } from "../../../state";
import { getDefaultIcon, calcOffset } from "../utils";
import styles from "../PopupContent/PopupContent.module.scss";

let cx = classNames.bind(styles);

const Marker = ({ x, y, scaleFactor, iconColor, spot }) => {
  const { coordinates, images } = spot;
  const { map, scale, latLngToLayerPoint } = useContext(PixiContext);
  const [, setMapState] = useRecoilState(mapRecoilState);
  const [, setPopup] = useRecoilState(popupState);
  const [editingEnabled, setEditingEnabled] = useState(false);
  const [popupClassName, setPopupClassName] = useState();
  const [spotOpacity, setSpotOpacity] = useState(1);
  const [spotLayerPoint, setSpotLayerPoint] = useState();
  const stateRef = useRef();

  useEffect(() => {
    const hasImages = !!images.length;
    setPopupClassName(
      cx({
        "has-images": hasImages,
        [styles.hasImages]: hasImages,
      })
    );
  }, [images]);

  // const relocateMarker = (latLng) => {
  //   setSpotLayerPoint(latLngToLayerPoint(latLng));
  //   setPopup({
  //     ...stateRef.popup,
  //     position: [latLng.lat, latLng.lng],
  //   });
  // };

  // const enableEditing = () => {
  //   console.log("editingEnabled");
  //   // used for determining popup panning function
  //   map.centerMapToPopup = true;

  //   map.on("click", (e) => {
  //     console.log("map.click");
  //     setSpotLayerPoint(latLngToLayerPoint(e.latlng));
  //     stateRef.popup = {
  //       props: {
  //         closeCallback: () => {
  //           disableEditing();
  //         },
  //       },
  //       position: [e.latlng.lat, e.latlng.lng],
  //       content: <SpotForm latlng={e.latlng} relocatePin={relocateMarker} />,
  //     };
  //     setPopup(stateRef.popup);
  //   });

  //   // todo: Why does this only work after clicking the map?
  //   map.on("keydown", (event) => {
  //     const e = event.originalEvent;
  //     if (e.key === "Escape" || e.key === "Esc" || e.keyCode === 27) {
  //       disableEditing();
  //     }
  //   });
  // };

  // const disableEditing = () => {
  //   console.log("editingDisabled");
  //   setPopup(null);
  //   map.off("click");
  //   map.off("mousemove");
  //   setMapState("default");
  //   map.state = null;
  // };

  // useEffect(() => {
  //   setSpotLayerPoint(latLngToLayerPoint(coordinates));
  // }, [coordinates]);

  // useEffect(() => {
  // if (editingEnabled) {
  //   enableEditing();
  // } else {
  //   disableEditing();
  // }
  // }, [editingEnabled]);

  const handleDragStart = (e) => {
    if (editingEnabled) {
      map.dragging.disable();
      map.closePopup(null, true);
      map.on("mousemove", (e) => {
        setSpotLayerPoint(latLngToLayerPoint(e.latlng));
      });
      setSpotOpacity(0.7);
    } else {
      stateRef.dragStart = { ...e.global };
    }
  };

  const handleDragEnd = (e) => {
    if (editingEnabled) {
      map.off("mousemove");
      map.dragging.enable();
      setSpotOpacity(1);
    } else {
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
    }
  };

  const handleClick = () => {
    if (!stateRef.markerWasDragged) {
      setPopup({
        props: {
          offset: [0, calcOffset(scaleFactor)],
          closeOnClick: true,
          //   closeCallback: () => {
          //     disableEditing();
          //   },
          className: popupClassName,
        },
        position: coordinates,
        content: <ViewSpot spot={spot} />,
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
      alpha={spotOpacity}
      scale={1 / scale}
    />
  ) : null;
};

export default Marker;

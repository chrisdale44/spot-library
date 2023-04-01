import React, { useState, useContext, useEffect, useRef, useMemo } from "react";
import { useRecoilState } from "recoil";
import SpotForm from "../../Forms/SpotForm";
import Marker from "../Marker";
import { PixiContext } from "../../../utils/middleware/ReactLeafletReactPixi";
import { mapState as mapRecoilState, popupState } from "../../../state";

const DraggableMarker = (props) => {
  const { id, spot, coordinates, x, y } = props;
  const { map, latLngToLayerPoint } = useContext(PixiContext);
  const [, setMapState] = useRecoilState(mapRecoilState);
  const [, setPopup] = useRecoilState(popupState);
  const [spotOpacity, setSpotOpacity] = useState(1);
  const [spotLayerPoint, setSpotLayerPoint] = useState({ x, y });
  const stateRef = useRef();

  const relocateMarker = (latLng) => {
    setSpotLayerPoint(latLngToLayerPoint(latLng));
    stateRef.popup = {
      ...stateRef.popup,
      position: [latLng.lat, latLng.lng],
      content: (
        <SpotForm
          id={id}
          spot={spot}
          latlng={latLng}
          relocateMarker={relocateMarker}
        />
      ),
    };
    stateRef.popup.position = [latLng.lat, latLng.lng];
    setPopup(stateRef.popup);
  };

  const cleanup = () => {
    setPopup(null);
    map.off("click");
    map.off("mousemove");
    setMapState(null);
    map.centerMapToPopup = false;
  };

  const initPopup = () => {
    stateRef.popup = {
      props: {
        closeCallback: () => {
          cleanup();
        },
      },
      position: coordinates,
      content: (
        <SpotForm
          id={id}
          spot={spot}
          latlng={coordinates}
          relocateMarker={relocateMarker}
        />
      ),
    };
  };

  const handleDragStart = () => {
    map.dragging.disable();
    map.closePopup(null, true);
    map.on("mousemove", (e) => {
      setSpotLayerPoint(latLngToLayerPoint(e.latlng));
    });
    setSpotOpacity(0.7);
  };

  const handleDragEnd = () => {
    map.off("mousemove");
    map.dragging.enable();
    setSpotOpacity(1);
  };

  const handleClick = () => {
    setPopup(stateRef.popup);
  };

  const handleMapClick = (e) => {
    setSpotLayerPoint(latLngToLayerPoint(e.latlng));
    stateRef.popup = {
      ...stateRef.popup,
      position: [e.latlng.lat, e.latlng.lng],
      content: (
        <SpotForm
          id={id}
          spot={spot}
          latlng={e.latlng}
          relocateMarker={relocateMarker}
        />
      ),
    };
    setPopup(stateRef.popup);
  };

  const handleKeyDown = (event) => {
    // todo: Why does this only work after clicking the map?
    const e = event.originalEvent;
    if (e.key === "Escape" || e.key === "Esc" || e.keyCode === 27) {
      cleanup();
    }
  };

  useEffect(() => {
    // used for determining popup panning function
    map.centerMapToPopup = true;
    map.on("click", handleMapClick);
    map.on("keydown", handleKeyDown);
    initPopup();
    setPopup(stateRef.popup);

    return () => {
      cleanup();
    };
  }, []);

  const eventHandlers = {
    pointerdown: handleDragStart,
    pointerup: handleDragEnd,
    pointerupoutside: handleDragEnd,
    click: handleClick,
    tap: handleClick,
  };

  return (
    <Marker
      {...props}
      {...eventHandlers}
      alpha={spotOpacity}
      x={spotLayerPoint.x}
      y={spotLayerPoint.y}
    />
  );
};

export default DraggableMarker;

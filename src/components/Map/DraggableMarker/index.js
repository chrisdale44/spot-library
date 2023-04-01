import React, { useState, useContext, useEffect, useRef, useMemo } from "react";
import { useRecoilState } from "recoil";
import Marker from "../Marker";
import EditSpot from "../PopupContent/EditSpot";
import { PixiContext } from "../../../utils/middleware/ReactLeafletReactPixi";
import { mapState as mapRecoilState, popupState } from "../../../state";

const DraggableMarker = (props) => {
  const { spot, x, y } = props;
  const { coordinates } = spot;
  const { map, latLngToLayerPoint } = useContext(PixiContext);
  const [, setMapState] = useRecoilState(mapRecoilState);
  const [, setPopup] = useRecoilState(popupState);

  const [spotOpacity, setSpotOpacity] = useState(1);
  const [spotLayerPoint, setSpotLayerPoint] = useState();
  const stateRef = useRef();

  const relocateMarker = (latLng) => {
    setSpotLayerPoint(latLngToLayerPoint(latLng));
    stateRef.popup = {
      ...stateRef.popup,
      position: [latLng.lat, latLng.lng],
      content: (
        <EditSpot spot={spot} latLng={latLng} relocateMarker={relocateMarker} />
      ),
    };
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
        className: "",
      },
      position: coordinates,
      content: (
        <EditSpot
          spot={spot}
          latLng={{ lat: coordinates[0], lng: coordinates[1] }}
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
        <EditSpot
          spot={spot}
          latLng={e.latlng}
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
    if (x && y && spot) {
      setSpotLayerPoint({
        x,
        y,
      });
      initPopup();
      setPopup(stateRef.popup);
    }

    return () => {
      cleanup();
    };
  }, [x, y, spot]);

  const eventHandlers = {
    pointerdown: handleDragStart,
    pointerup: handleDragEnd,
    pointerupoutside: handleDragEnd,
    click: handleClick,
    tap: handleClick,
  };

  return spotLayerPoint ? (
    <Marker
      {...props}
      {...eventHandlers}
      alpha={spotOpacity}
      x={spotLayerPoint.x}
      y={spotLayerPoint.y}
    />
  ) : null;
};

DraggableMarker.defaultProps = {
  spot: {},
};

export default DraggableMarker;

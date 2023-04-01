import React, { useState, useContext, useEffect, useRef, useMemo } from "react";
import { useRecoilState } from "recoil";
import SpotForm from "../../Forms/SpotForm";
import Marker from "../Marker";
import Dialog from "../../Modal/Dialog";
import { PixiContext } from "../../../utils/middleware/ReactLeafletReactPixi";
import {
  mapState as mapRecoilState,
  popupState,
  modalState,
} from "../../../state";

const DraggableMarker = (props) => {
  const { spot, x, y } = props;
  const { id, coordinates } = spot;
  const { map, latLngToLayerPoint } = useContext(PixiContext);
  const [, setMapState] = useRecoilState(mapRecoilState);
  const [, setPopup] = useRecoilState(popupState);
  const [, setModal] = useRecoilState(modalState);
  const [spotOpacity, setSpotOpacity] = useState(1);
  const [spotLayerPoint, setSpotLayerPoint] = useState();
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
          handleExifLocationMismatch={handleExifLocationMismatch}
        />
      ),
    };
    stateRef.popup.position = [latLng.lat, latLng.lng];
    setPopup(stateRef.popup);
  };

  const relocateMarkerDialog = (latLng, relocateMarker) => (
    <Dialog yesCallback={() => relocateMarker(latLng)}>
      <p>Image was taken at different location to pin.</p>
      <p>Do you want to relocate the pin?</p>
    </Dialog>
  );

  const handleExifLocationMismatch = (newCoordinates) => {
    setModal(relocateMarkerDialog(newCoordinates, relocateMarker));
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
        <SpotForm
          id={id}
          spot={spot}
          latlng={coordinates}
          handleExifLocationMismatch={handleExifLocationMismatch}
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
          handleExifLocationMismatch={handleExifLocationMismatch}
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

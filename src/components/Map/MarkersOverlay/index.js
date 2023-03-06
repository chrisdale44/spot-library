import React, { useState, useContext, useEffect, useRef } from "react";
import Image from "next/image";
import { useRecoilState } from "recoil";
import { renderToString } from "react-dom/server";
import L from "leaflet";
import { Sprite } from "@pixi/react";
import { getDefaultIcon } from "../utils";
import { modalState } from "../../../state";
import { PixiContext } from "../../../utils/middleware/ReactLeafletReactPixi";
import styles from "./MarkersOverlay.module.scss";

const generateMarkersWithPopup = (
  spots,
  markerClickHandler,
  popupClickHandler
) => {
  return spots.map(({ id, name, coordinates, images }) => {
    const popupHtml = L.DomUtil.create("div", "content");

    // Limitation: renderToString gives you your react component in pure HTML as it would look in a
    // particular state. It does not give fully functionaly react components
    // Todo: use popupState to set react-leaflet Popup
    popupHtml.innerHTML = renderToString(
      <div className={styles.popupContainer}>
        <h3>{name}</h3>
        {images.length ? (
          <Image loading="lazy" src={images[0].url} layout="fill" />
        ) : null}
      </div>
    );
    popupHtml.addEventListener("click", () => popupClickHandler(id));

    const popup = L.popup({
      id,
      offset: [0, -28],
      closeOnClick: true,
    })
      .setLatLng(coordinates)
      .setContent(popupHtml);

    return {
      id,
      iconColor: "#187bcd",
      coordinates: [parseFloat(coordinates[0]), parseFloat(coordinates[1])],
      interactive: true,
      buttonMode: true,
      tap: () => markerClickHandler(popup),
      click: () => markerClickHandler(popup),
    };
  });
};

const MarkersOverlay = ({ spots }) => {
  const [markers, setMarkers] = useState([]);
  const [, setModal] = useRecoilState(modalState);
  const { latLngToLayerPoint, scale, map } = useContext(PixiContext);

  let eStart = useRef();
  let markerWasDragged = useRef();

  const handleDragStart = (e) => {
    eStart.current = { ...e.global };
  };

  const handleDragEnd = (e) => {
    if (!eStart.current) return;

    // todo: allow for some movement when tapping
    if (eStart.current.x !== e.global.x || eStart.current.y !== e.global.y) {
      markerWasDragged.current = true;
    }
  };

  const markerClickHandler = (popup) => {
    if (!markerWasDragged.current) map.openPopup(popup);
    markerWasDragged.current = false;
    eStart.current = null;
  };

  const popupClickHandler = (id) => {
    setModal({
      type: "openSpot",
      id,
    });
  };

  useEffect(() => {
    setMarkers(
      generateMarkersWithPopup(spots, markerClickHandler, popupClickHandler)
    );
  }, [spots]);

  return (
    <>
      {markers.length
        ? markers.map((marker, i) => {
            const { x, y } = latLngToLayerPoint(marker.coordinates);
            return (
              <Sprite
                key={i}
                x={x}
                y={y}
                scale={1 / scale}
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

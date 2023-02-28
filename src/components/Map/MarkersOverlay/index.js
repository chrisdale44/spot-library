import React, { useState, useContext, useEffect } from "react";
import { useRecoilState } from "recoil";
import { Container, Sprite } from "@pixi/react";
import { renderToString } from "react-dom/server";
import ImageGallery from "react-image-gallery";
import L from "leaflet";
import { modalState } from "../../../state";
import { getDefaultIcon } from "../utils";
import { PixiContext } from "../../../utils/middleware/ReactLeafletReactPixi";
import styles from "./MarkersOverlay.module.scss";

const generateMarkers = (spots, map, popupClickHandler) => {
  console.log("generate Markers");

  return spots.map(({ id, name, coordinates, images }) => {
    const popupHtml = L.DomUtil.create("div", "content");
    popupHtml.innerHTML = renderToString(
      <div className={styles.popupContainer}>
        {name}
        {images.length ? (
          <ImageGallery
            items={images.map((image) => ({
              original: image.url,
              loading: "lazy",
            }))}
            lazyLoad={true}
            showPlayButton={false}
            showFullscreenButton={false}
          />
        ) : null}
      </div>
    );
    popupHtml.addEventListener("click", () => popupClickHandler(id));

    const markerClickHandler = (e) => {
      e.stopPropagation();
      const popup = L.popup({
        id,
        offset: [0, -28],
        closeOnClick: true,
      })
        .setLatLng(coordinates)
        .setContent(popupHtml);

      map.openPopup(popup);
    };

    return {
      id: id,
      iconColor: "#187bcd",
      coordinates: [parseFloat(coordinates[0]), parseFloat(coordinates[1])],
      interactive: true,
      tap: markerClickHandler,
      click: markerClickHandler,
    };
  });
};

const MarkersOverlay = ({ spots }) => {
  const [markers, setMarkers] = useState([]);
  const [, setModal] = useRecoilState(modalState);
  const { latLngToLayerPoint, scale, map } = useContext(PixiContext);

  const popupClickHandler = (id) => {
    console.log(id);
    setModal({
      type: "openSpot",
      id,
    });
  };

  useEffect(() => {
    console.log("set markers");
    setMarkers(generateMarkers(spots, map, popupClickHandler));
  }, [spots]);

  return (
    <Container options={{ backgroundAlpha: 0 }}>
      {markers.length
        ? markers.map((marker) => {
            const { x, y } = latLngToLayerPoint(marker.coordinates);
            return (
              <Sprite
                key={marker.id}
                x={x}
                y={y}
                anchor={[0.5, 1]}
                scale={1 / scale}
                image={getDefaultIcon(marker.iconColor)}
                {...marker}
              />
            );
          })
        : null}
    </Container>
  );
};

export default MarkersOverlay;

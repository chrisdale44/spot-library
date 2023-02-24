import React, { useState, useContext, useEffect } from "react";
// import { useRecoilState } from "recoil";
import { Container, Sprite } from "@pixi/react";
import { Popup } from "react-leaflet";
import { renderToString } from "react-dom/server";
import ImageGallery from "react-image-gallery";
import L from "leaflet";
// import { modalState } from "../../state";
import { getDefaultIcon } from "../utils";
import { PixiContext } from "../../../utils/middleware/ReactLeafletReactPixi";
import styles from "./MarkersOverlay.module.scss";

const generateMarkers = (spots, map) => {
  console.log("generate Markers");
  // const [, setModal] = useRecoilState(modalState);

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

    return {
      id: id,
      iconColor: "#187bcd",
      coordinates: [parseFloat(coordinates[0]), parseFloat(coordinates[1])],
      interactive: true,
      click: () => {
        console.log(map);
        const popup = L.popup({
          id,
          offset: [-17, -28],
        })
          .setLatLng(coordinates)
          .setContent(popupHtml);

        map.openPopup(popup);

        // const renderer = map.getRenderer();
        // const container = map.getContainer();
        // renderer.render(container);
      },
      // popupClick: (id) => {
      //   console.log(id);
      //   L.setModal({
      //     type: "openSpot",
      //     id,
      //   });
      // },
    };
  });
};

const MarkersOverlay = ({ spots }) => {
  const [markers, setMarkers] = useState([]);
  const { latLngToLayerPoint, scale, map } = useContext(PixiContext);

  useEffect(() => {
    console.log("set markers");
    setMarkers(generateMarkers(spots, map));
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
                anchor={(0.5, 1)}
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

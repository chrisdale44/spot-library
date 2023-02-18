import React, { useEffect, useState, useContext } from "react";
import { useRecoilState } from "recoil";
import { renderToString } from "react-dom/server";
import L from "leaflet";
import { MapContainer, TileLayer } from "react-leaflet";
import { Container, Sprite } from "@pixi/react";
import {
  PixiContext,
  PixiContainer,
} from "../../utils/middleware/ReactLeafletReactPixi";
import ImageGallery from "react-image-gallery";
// import SearchField from "./SearchField";
import { modalState } from "../../state";
import { getDefaultIcon } from "./utils";
import "leaflet/dist/leaflet.css";
import styles from "./Map.module.scss";

const Map = ({ spots }) => {
  const [, setModal] = useRecoilState(modalState);

  const generateMarkers = (spots) =>
    spots.map(({ id, name, coordinates, images, imgUrls, media }) => ({
      id: id,
      coordinates: [parseFloat(coordinates[0]), parseFloat(coordinates[1])],
      popup: L.popup({
        id,
        offset: [0, -28],
        autoClose: false,
        closeButton: false, // todo: debug why close button takes two clicks
      }),
      popupContent: renderToString(
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
      ),
      interactive: true,
      eventMode: "static",
      click: () => console.log(id),
      popupClick: (id) => {
        console.log(id);
        setModal({
          type: "openSpot",
          id,
        });
      },
      iconColor: "#187bcd",
    }));

  const [markers, setMarkers] = useState(generateMarkers(spots));

  useEffect(() => {
    console.log("set markers");
    setMarkers(generateMarkers(spots));
  }, [spots]);

  return (
    <MapContainer
      center={[51.505, -0.09]}
      zoom={13}
      scrollWheelZoom={true}
      style={{ position: "fixed", top: "50px", left: 0, right: 0, bottom: 0 }}
      preferCanvas={true}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <PixiContainer>
        <MarkersOverlay markers={markers} />
      </PixiContainer>
    </MapContainer>
  );
};

function MarkersOverlay({ markers }) {
  const { latLngToLayerPoint, scale } = useContext(PixiContext);

  return (
    <Container options={{ backgroundAlpha: 0 }}>
      {markers.map((marker) => {
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
      })}
    </Container>
  );
}

export default Map;

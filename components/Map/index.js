import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { renderToString } from "react-dom/server";
import { MapContainer, TileLayer } from "react-leaflet";
import ImageGallery from "react-image-gallery";
import SearchField from "./SearchField";
import MarkersOverlay from "./MarkersOverlay";
import { modalState } from "../../state";
import "leaflet/dist/leaflet.css";
import styles from "./Map.module.scss";

const Map = ({ spots }) => {
  const [, setModal] = useRecoilState(modalState);

  const generateMarkers = (spots) =>
    spots.map(({ id, name, coordinates, images, imgUrls, media }) => ({
      id: id,
      position: [parseFloat(coordinates[0]), parseFloat(coordinates[1])],
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
      <SearchField />
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MarkersOverlay markers={markers} />
    </MapContainer>
  );
};

export default Map;

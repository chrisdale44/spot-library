import React, { useEffect, useState } from "react";
// import { useRecoilState } from "recoil";
// import { renderToString } from "react-dom/server";
import { MapContainer, TileLayer } from "react-leaflet";
import { Container, Sprite } from "@pixi/react";
import { PixiRoot } from "../../utils/middleware/ReactLeafletReactPixi";
import {
  useScale,
  useProject,
  useTick,
} from "../../utils/middleware/ReactLeafletReactPixi/hooks";
// import ImageGallery from "react-image-gallery";
// import SearchField from "./SearchField";
// import { modalState } from "../../state";
import "leaflet/dist/leaflet.css";
// import styles from "./Map.module.scss";

const Map = () => (
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
    <PixiRoot>
      <MyContent />
    </PixiRoot>
  </MapContainer>
);

function MyContent() {
  const [containerX, containerY] = useProject([51.5, -0.09]);
  const [markerOffset, setMarkerOffset] = useState(0);
  const [markerX, markerY] = useProject(
    [51.5, -0.09 + markerOffset],
    [containerX, containerY]
  );
  const scale = useScale();

  const [direction, setDirection] = useState(1);
  useTick((delta) => {
    setMarkerOffset((val) => val + (delta * direction) / 3000);
    if (markerOffset > 0.05) {
      setDirection(-1);
    } else if (markerOffset < -0.05) {
      setDirection(1);
    }
  });

  return (
    <Container x={containerX} y={containerY} options={{ backgroundAlpha: 0 }}>
      <Sprite
        x={markerX}
        y={markerY}
        anchor={0.5}
        scale={1 / scale}
        image="https://s3-us-west-2.amazonaws.com/s.cdpn.io/693612/IaUrttj.png"
      />
    </Container>
  );
}

export default Map;

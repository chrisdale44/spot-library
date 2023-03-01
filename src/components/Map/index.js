import React from "react";
import { useRecoilState } from "recoil";
import { MapContainer, TileLayer } from "react-leaflet";
import { Container } from "@pixi/react";
import { mapState as mapRecoilState } from "../../state";
import { PixiContainer } from "../../utils/middleware/ReactLeafletReactPixi";
import MarkersOverlay from "./MarkersOverlay";
// import SearchField from "./SearchField";
import AddSpot from "./AddSpot";
import "leaflet/dist/leaflet.css";

const Map = ({ spots }) => {
  const [mapState] = useRecoilState(mapRecoilState);

  return (
    <div className={mapState === "addSpot" ? "crosshair-cursor-enabled" : ""}>
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
          <Container options={{ backgroundAlpha: 0 }}>
            {mapState === "addSpot" && <AddSpot />}
            <MarkersOverlay spots={spots} />
          </Container>
        </PixiContainer>
      </MapContainer>
    </div>
  );
};

export default Map;

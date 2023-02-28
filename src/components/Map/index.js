import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { PixiContainer } from "../../utils/middleware/ReactLeafletReactPixi";
import MarkersOverlay from "./MarkersOverlay";
// import SearchField from "./SearchField";
import "leaflet/dist/leaflet.css";

const Map = ({ spots }) => {
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
        <MarkersOverlay spots={spots} />
      </PixiContainer>
    </MapContainer>
  );
};

export default Map;

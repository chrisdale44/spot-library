import React from "react";
import { useRecoilState } from "recoil";
import { renderToString } from "react-dom/server";
import { MapContainer, TileLayer } from "react-leaflet";
import SearchField from "./SearchField";
import MarkersOverlay from "./MarkersOverlay";
import { modalState } from "../../state";
import "leaflet/dist/leaflet.css";

const Map = ({ spots }) => {
  const [, setModal] = useRecoilState(modalState);
  const markers = spots.map((spot) => {
    return {
      id: spot.id,
      position: [
        parseFloat(spot.coordinates[0]),
        parseFloat(spot.coordinates[1]),
      ],
      popupContent: renderToString(spot.name),
      popupClick: (id) => {
        console.log(id);
        setModal({
          type: "spot",
          id,
        });
      },
      iconColor: "#187bcd",
    };
  });

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

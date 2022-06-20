import React from "react";
import { renderToString } from "react-dom/server";
import { MapContainer, TileLayer } from "react-leaflet";
import SearchField from "./SearchField";
import PixiOverlay from "react-leaflet-pixi-overlay";
import "leaflet/dist/leaflet.css";

const Map = ({ spots }) => {
  const markers = spots.map((spot) => {
    return {
      id: spot.id,
      position: spot.coordinates,
      popup: renderToString(<div>Hello</div>),
      //   iconColor: "#187bcd",
      iconId: "someIDUniqueToIcon",
      customIcon:
        '<svg style="-webkit-filter: drop-shadow( 1px 1px 1px rgba(0, 0, 0, .4));filter: drop-shadow( 1px 1px 1px rgba(0, 0, 0, .4));" xmlns="http://www.w3.org/2000/svg" fill="red" width="36" height="36" viewBox="0 0 24 24"><path d="M12 0c-4.198 0-8 3.403-8 7.602 0 6.243 6.377 6.903 8 16.398 1.623-9.495 8-10.155 8-16.398 0-4.199-3.801-7.602-8-7.602zm0 11c-1.657 0-3-1.343-3-3s1.342-3 3-3 3 1.343 3 3-1.343 3-3 3z"/></svg>',
    };
  });
  console.log(markers);
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
      <PixiOverlay markers={markers} />
    </MapContainer>
  );
};

export default Map;

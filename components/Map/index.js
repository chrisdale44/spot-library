import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import SearchField from "./SearchField";
import LeafletCanvasMarker from "./LeafletCanvasMarker";
import "leaflet/dist/leaflet.css";

const Map = ({ spots }) => {
  //   const markers =
  //     spots &&
  //     spots.map((spot, i) => (
  //       <Marker
  //         position={spot.coordinates}
  //         key={i}
  //         properties={{
  //           key: i,
  //           latitude: spot.coordinates[0],
  //           longitude: spot.coordinates[1],
  //         }}
  //         icon={defaultIcon}
  //       >
  //         <Tooltip spot={spot} />
  //       </Marker>
  //     ));
  console.log(spots);
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
      <LeafletCanvasMarker spots={spots} />
    </MapContainer>
  );
};

export default Map;

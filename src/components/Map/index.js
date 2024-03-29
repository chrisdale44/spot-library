import React from "react";
import { useRecoilState } from "recoil";
import { MapContainer, TileLayer, Popup } from "react-leaflet";
import { Container } from "@pixi/react";
import MapChildren from "./MapChildren";
import { mapState as mapRecoilState, popupState } from "../../state";
import { PixiContainer } from "../../utils/middleware/ReactLeafletReactPixi";
import MapControls from "./MapChildren/MapControls";

import "leaflet/dist/leaflet.css";

const Map = ({ id, spots }) => {
  const [mapState] = useRecoilState(mapRecoilState);
  const [popup, setPopup] = useRecoilState(popupState);

  const defaultPopupProps = {
    offset: [0, -26],
    closeOnClick: true,
    closeCallback: () => {
      setPopup(null);
    },
  };

  const enableCrosshair =
    mapState?.id === "addSpot" ||
    mapState?.id === "editSpot" ||
    mapState?.id === "searchResultSelected";

  return (
    <div id={id} className={enableCrosshair ? "crosshair-cursor-enabled" : ""}>
      <MapContainer
        center={[-37.8024221, 144.9580077]}
        zoom={13}
        minZoom={2}
        scrollWheelZoom={false} // disable default zoom function
        smoothWheelZoom={true} // enable smooth zoom lib
        smoothSensitivity={20}
        style={{ position: "fixed", top: "50px", left: 0, right: 0, bottom: 0 }}
        preferCanvas={true}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          noWrap={true}
          keepBuffer={30}
        />
        <PixiContainer>
          <Container options={{ backgroundAlpha: 0, useContextAlpha: true }}>
            <MapChildren spots={spots} />
          </Container>
        </PixiContainer>

        <MapControls />

        {popup && (
          <Popup
            {...defaultPopupProps}
            {...popup.props}
            position={popup.position}
          >
            {popup.content}
          </Popup>
        )}
      </MapContainer>
    </div>
  );
};

export default Map;

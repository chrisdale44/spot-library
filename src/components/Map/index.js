import React from "react";
import { useRecoilState } from "recoil";
import { MapContainer, TileLayer, Popup } from "react-leaflet";
import { Container } from "@pixi/react";
import { mapState as mapRecoilState, popupState } from "../../state";
import { PixiContainer } from "../../utils/middleware/ReactLeafletReactPixi";
import MarkersOverlay from "./MarkersOverlay";
// import SearchField from "./SearchField";
import "leaflet/dist/leaflet.css";

const Map = ({ spots }) => {
  const [mapState] = useRecoilState(mapRecoilState);
  const [popup] = useRecoilState(popupState);

  // todo: offset scale
  const defaultPopupProps = {
    offset: [0, -26],
    closeOnClick: true,
  };

  const enableCrosshair =
    mapState?.id === "addSpot" || mapState?.id === "editSpot";

  return (
    <div className={enableCrosshair ? "crosshair-cursor-enabled" : ""}>
      <MapContainer
        center={[51.505, -0.09]}
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
        />
        <PixiContainer>
          <Container options={{ backgroundAlpha: 0 }}>
            <MarkersOverlay spots={spots} />
          </Container>
        </PixiContainer>
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

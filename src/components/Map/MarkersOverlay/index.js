import React, { useContext, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import Marker from "../Marker";
import { mapState as mapRecoilState } from "../../../state";
import { PixiContext } from "../../../utils/middleware/ReactLeafletReactPixi";
import { calcScaleFactor } from "../../../utils/calcScaleFactor";
import DraggableMarker from "../DraggableMarker";

const MarkersOverlay = ({ spots }) => {
  const { latLngToLayerPoint, scale } = useContext(PixiContext);
  const [mapState] = useRecoilState(mapRecoilState);
  const [markers, setMarkers] = useState([]);

  const scaleFactor = calcScaleFactor(scale);

  useEffect(() => {
    setMarkers(
      spots.map((spot) => ({
        ...spot,
        layerPoint: latLngToLayerPoint(spot.coordinates),
      }))
    );
  }, [spots]);

  return (
    <>
      {markers.length
        ? markers.map((marker, i) => {
            const isEditingEnabled =
              mapState?.id === "editSpot" && mapState?.spotId === marker.id;

            return isEditingEnabled ? (
              <DraggableMarker
                key={i}
                x={marker.layerPoint.x}
                y={marker.layerPoint.y}
                iconColor="#00cc00"
                scaleFactor={scaleFactor}
                spot={marker}
              />
            ) : (
              <Marker
                key={i}
                x={marker.layerPoint.x}
                y={marker.layerPoint.y}
                iconColor="#187bcd"
                scaleFactor={scaleFactor}
                spot={marker}
              />
            );
          })
        : null}
      {mapState?.id === "addSpot" ? (
        <DraggableMarker iconColor="#00cc00" scaleFactor={scaleFactor} />
      ) : null}
      {mapState?.id === "searchResultSelected" ? (
        <DraggableMarker
          iconColor="#00cc00"
          scaleFactor={scaleFactor}
          x={mapState.layerPoint.x}
          y={mapState.layerPoint.y}
          spot={{ coordinates: mapState.coordinates }}
        />
      ) : null}
    </>
  );
};

export default MarkersOverlay;

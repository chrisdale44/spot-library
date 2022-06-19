import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-canvas-marker";

export default function LeafletCanvasMarker({ spots }) {
  if (!spots) return;
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    var ciLayer = L.canvasIconLayer({}).addTo(map);

    ciLayer.addOnClickListener(function (e, data) {
      console.log(data);
    });
    ciLayer.addOnHoverListener(function (e, data) {
      console.log(data[0].data._leaflet_id);
    });

    var icon = L.icon({
      iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      iconSize: [18, 24],
      iconAnchor: [10, 9],
    });

    var markers = [];
    for (var i = 0; i < spots.length; i++) {
      var marker = L.marker(spots[i].coordinates, { icon: icon }).bindPopup(
        spots[i].name
      );
      markers.push(marker);
    }
    ciLayer.addLayers(markers);
  }, [map]);

  return null;
}

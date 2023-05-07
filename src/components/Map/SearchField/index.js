import { useEffect } from "react";
import L from "leaflet";
import { useMap } from "react-leaflet";
import { OpenStreetMapProvider, GeoSearchControl } from "leaflet-geosearch";

const SearchField = () => {
  const map = useMap();

  useEffect(() => {
    map.on("geosearch/showlocation", (props) => {
      console.log("fired", props);
    });

    const provider = new OpenStreetMapProvider({
      params: {
        getViewbox: () => {
          const bounds = map.getBounds();
          return `${bounds._southWest.lng},${bounds._southWest.lat},${bounds._northEast.lng},${bounds._northEast.lat}`;
        },
      },
    });

    const markerIcon = L.icon({
      iconUrl: "/marker-icon.svg",
      iconRetinaUrl: "/marker-icon.svg",
      iconSize: [36, 36],
      // iconAnchor: [0, 0],
      popupAnchor: [0, -15],
    });

    const searchControl = new GeoSearchControl({
      provider,
      style: "button",
      showMarker: true,
      showPopup: true,
      autoClose: false,
      retainZoomLevel: true,
      animateZoom: true,
      keepResult: false,
      searchLabel: "Search",
      marker: {
        icon: markerIcon,
      },
      popupFormat: ({ query, result }) => {
        console.log(result);
        return `<div class="selected-search-result">${result.label}</div>`;
      },
    });
    map.addControl(searchControl);
    return () => {
      map.removeControl(searchControl);
      map.off("geosearch/showlocation");
    };
  }, []);

  return null;
};

export default SearchField;

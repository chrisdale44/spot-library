import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { OpenStreetMapProvider, GeoSearchControl } from "leaflet-geosearch";

const SearchField = () => {
  const map = useMap();

  useEffect(() => {
    const provider = new OpenStreetMapProvider({
      params: {
        getViewbox: () => {
          const bounds = map.getBounds();
          return `${bounds._southWest.lng},${bounds._southWest.lat},${bounds._northEast.lng},${bounds._northEast.lat}`;
        },
      },
    });

    const searchControl = new GeoSearchControl({
      provider,
      style: "button",
      showMarker: true,
      showPopup: true,
      autoClose: false,
      retainZoomLevel: false,
      animateZoom: true,
      keepResult: false,
      searchLabel: "Search",
    });
    map.addControl(searchControl);
    return () => map.removeControl(searchControl);
  }, []);

  return null;
};

export default SearchField;

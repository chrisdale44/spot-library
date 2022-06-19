import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { OpenStreetMapProvider, GeoSearchControl } from "leaflet-geosearch";

const SearchField = () => {
  const map = useMap();

  useEffect(() => {
    const provider = new OpenStreetMapProvider();
    const searchControl = new GeoSearchControl({
      provider,
    });
    map.addControl(searchControl);
    return () => map.removeControl(searchControl);
  }, []);

  return null;
};

export default SearchField;

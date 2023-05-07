import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { useRecoilState } from "recoil";
import { OpenStreetMapProvider, GeoSearchControl } from "leaflet-geosearch";
import { mapState as mapRecoilState } from "../../../state/map";

const SearchField = () => {
  const map = useMap();
  const [, setMapState] = useRecoilState(mapRecoilState);

  useEffect(() => {
    map.on("geosearch/showlocation", (result) => {
      console.log("set draggable marker: ", result);
      setMapState({
        id: "searchResultSelected",
        result,
      });
    });

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
      showMarker: false,
      showPopup: false,
      autoClose: false,
      retainZoomLevel: true,
      animateZoom: true,
      keepResult: false,
      searchLabel: "Search",
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

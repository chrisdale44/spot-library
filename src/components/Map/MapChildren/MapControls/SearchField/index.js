import { useEffect, useContext } from "react";
import { useRecoilState } from "recoil";
import { PixiContext } from "../../../../../utils/middleware/ReactLeafletReactPixi";
import { OpenStreetMapProvider, GeoSearchControl } from "leaflet-geosearch";
import { mapState as mapRecoilState } from "../../../../../state/map";

const SearchField = () => {
  const { map, latLngToLayerPoint } = useContext(PixiContext);
  const [, setMapState] = useRecoilState(mapRecoilState);

  useEffect(() => {
    map.on("geosearch/showlocation", (result) => {
      const { x, y, label } = result.location;
      setMapState({
        id: "searchResultSelected",
        coordinates: [y, x],
        layerPoint: latLngToLayerPoint({
          lat: y,
          lng: x,
        }),
        label,
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
      updateMap: true,
      maxMarker: 5,
      retainZoomLevel: true,
      animateZoom: true,
      keepResult: false,
      searchLabel: "Search address",
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

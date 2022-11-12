import { useEffect, useState } from "react";
import * as PIXI from "pixi.js"; // n.b. uses v5
import "leaflet-pixi-overlay";
import { useMap } from "react-leaflet";
import { getDefaultIcon } from "./utils";
import createLeafletOverlay from "./createOverlay";

PIXI.utils.skipHello();
const loader = PIXI.Loader.shared;

const loadSprite = async ({ iconColor }) => {
  return new Promise((resolve, reject) => {
    if (!iconColor) resolve();
    if (loader.resources[`marker_${iconColor}`]) resolve();

    loader.add(`marker_${iconColor}`, getDefaultIcon(iconColor));

    loader.onComplete.add(() => {
      resolve();
    });

    loader.onError.add(() => {
      reject();
    });
  });
};

const MarkersOverlay = ({ markers }) => {
  const map = useMap();
  const [firstRender, setFirstRender] = useState(true);
  const [pixiContainer, setPixiContainer] = useState();
  const [leafletOverlay, setLeafletOverlay] = useState();

  useEffect(() => {
    console.log("markers changed");
    const loadSprites = async (markers) => {
      console.log("load sprites");
      if (loader.loading) {
        loader.reset();
      }

      await Promise.all(markers.map(async (marker) => loadSprite(marker)));
    };

    // Run this just once and then the Overlay Load callback handles re-renders
    if (firstRender) {
      loadSprites(markers).catch(console.error);

      const container = new PIXI.Container(markers.length, {
        vertices: true,
      });
      container.interactive = true;
      container.buttonMode = true;

      createLeafletOverlay({
        loader,
        container,
        allMarkers: markers,
        map,
        setLeafletOverlay,
      });
      setPixiContainer(container);
      setFirstRender(false);
    }
  }, [markers, firstRender]);

  // todo: clear map and redraw?
  // check if markers have actually changed
  if (!firstRender && leafletOverlay) {
    console.log("redraw overlay");
    leafletOverlay.redraw(markers);
    // //pixiContainer.render();

    // const a = pixiContainer.removeChildren(0, 10);
    // console.log(pixiContainer.children.length, pixiContainer.utils);
    // console.log(a);
    // // pixiContainer.render();
  }
};

export default MarkersOverlay;

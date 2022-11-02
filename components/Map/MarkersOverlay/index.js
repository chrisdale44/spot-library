import { useEffect, useState } from "react";
import * as PIXI from "pixi.js";
import "leaflet-pixi-overlay";
import { useMap } from "react-leaflet";
import { getDefaultIcon } from "./utils";
import createOverlay from "./createOverlay";

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

  useEffect(() => {
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
      createOverlay({ loader, container, markers, map });
      setPixiContainer(container);
      setFirstRender(false);
    }
  }, [markers, firstRender]);

  // useEffect(() => {
  //   console.log("markers changed?");
  //   if (pixiContainer) {
  //     console.log("removeChildren", markers.length);
  //     console.log(pixiContainer);
  //     pixiContainer.removeChildren();
  //   }

  //   return () => {
  //     if (pixiContainer) pixiContainer.removeChildren();
  //   };
  // }, [markers, pixiContainer]);
};

export default MarkersOverlay;

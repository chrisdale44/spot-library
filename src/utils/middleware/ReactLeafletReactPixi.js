/*
  Based on http://github.com/maliut/react-leaflet-react-pixi
*/

import * as PIXI from "pixi.js";
import "leaflet-pixi-overlay"; // Must be called before the 'leaflet' import
import L from "leaflet";
import "../../libs/SmoothWheelZoom";
import { useCallback, useEffect, useState, createContext } from "react";
import { useMap } from "react-leaflet";
import { createRoot } from "@pixi/react";
import { useRecoilBridgeAcrossReactRoots_UNSTABLE } from "recoil";

// create pixi container
const container = new PIXI.Container({ backgroundAlpha: 0 });
// const boundary = new PIXI.EventBoundary(container); // Todo: stop pixi layer click events propagating down to map layer
// create  root
const root = createRoot(container);

export const PixiContext = createContext({});

export function PixiContainer({ children }) {
  const map = useMap();
  const [scale, setScale] = useState(1);
  // create bridge for Recoil state
  const RecoilBridge = useRecoilBridgeAcrossReactRoots_UNSTABLE();

  const [pixiOverlay] = useState(
    // create a leaflet-pixi-overlay
    L.pixiOverlay(
      (utils) => {
        // Leaflet utils
        const container = utils.getContainer();
        const renderer = utils.getRenderer();
        setScale(utils.getScale());
        renderer.render(container);
      },
      container,
      { backgroundAlpha: 0, shouldRedrawOnMove: () => true }
    )
  );

  useEffect(() => {
    // add leaflet-pixi-overlay to leaflet map
    pixiOverlay.addTo(map);
  }, [map, pixiOverlay]);

  const [needsRenderUpdate, setNeedsRenderUpdate] = useState(false);

  const requestUpdate = useCallback(() => {
    setNeedsRenderUpdate(true);
  }, []);

  const renderStage = useCallback(() => {
    if (needsRenderUpdate) {
      setNeedsRenderUpdate(false);
      pixiOverlay.redraw(container);
    }
  }, [needsRenderUpdate, pixiOverlay]);

  useEffect(() => {
    const ticker = PIXI.Ticker.shared;
    ticker.autoStart = true;
    ticker.add(renderStage);
    container.addEventListener("__REACT_PIXI_REQUEST_RENDER__", requestUpdate);

    return () => {
      ticker.remove(renderStage);
      container.removeEventListener(
        "__REACT_PIXI_REQUEST_RENDER__",
        requestUpdate
      );
    };
  }, [renderStage, requestUpdate]);

  useEffect(() => {
    const provider = (
      <PixiContext.Provider
        value={{
          ...pixiOverlay.utils,
          scale,
          map,
        }}
      >
        <RecoilBridge>{children}</RecoilBridge>
      </PixiContext.Provider>
    );

    // render pixi context provider, pixi container
    root.render(provider, container);
  }, [children, pixiOverlay, scale]);
}

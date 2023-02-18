/*
  Based on http://github.com/maliut/react-leaflet-react-pixi
*/

import * as PIXI from "pixi.js";
import "leaflet-pixi-overlay"; // Must be called before the 'leaflet' import
import L from "leaflet";
import { useCallback, useEffect, useState, createContext } from "react";
import { useMap } from "react-leaflet";
import { createRoot } from "@pixi/react";

const container = new PIXI.Container({ backgroundAlpha: 0 });
const root = createRoot(container);

export const PixiContext = createContext({});

export function PixiContainer({ children }) {
  const map = useMap();
  const [scale, setScale] = useState(1);

  const [pixiOverlay] = useState(
    L.pixiOverlay(
      (utils) => {
        const container = utils.getContainer();
        const renderer = utils.getRenderer();
        setScale(utils.getScale());
        renderer.render(container);
      },
      container,
      { backgroundAlpha: 0 }
    )
  );

  useEffect(() => {
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
        }}
      >
        {children}
      </PixiContext.Provider>
    );

    root.render(provider, container);
  }, [children, pixiOverlay, scale]);
}

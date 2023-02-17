/*
  Based on http://github.com/maliut/react-leaflet-react-pixi
*/

import * as PIXI from "pixi.js";
import "leaflet-pixi-overlay"; // Must be called before the 'leaflet' import
import L from "leaflet";

import { useCallback, useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import { createRoot } from "@pixi/react";
import { PixiOverlayProvider } from "./hooks";

const container = new PIXI.Container({ backgroundAlpha: 0 });
const root = createRoot(container);

export function PixiRoot({ children }) {
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
    const project = pixiOverlay.utils.latLngToLayerPoint;
    const provider = (
      <PixiOverlayProvider value={{ project, scale }}>
        {children}
      </PixiOverlayProvider>
    );

    root.render(provider, container);
  }, [children, pixiOverlay, scale]);
}

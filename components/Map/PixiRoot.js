import "leaflet-pixi-overlay"; // Must be called before the 'leaflet' import
import L from "leaflet";
import * as PIXI from "pixi.js";
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
    L.pixiOverlay((utils) => {
      const container = utils.getContainer();
      const renderer = utils.getRenderer();
      setScale(utils.getScale());
      renderer.render(container);
    }, container)
  );

  useEffect(() => {
    pixiOverlay.addTo(map);
  }, [map, pixiOverlay]);

  const [needsRenderUpdate, setNeedsRenderUpdate] = useState(false);

  const requestUpdate = useCallback(() => {
    console.log("request update");
    setNeedsRenderUpdate(true);
  }, []);

  const renderStage = useCallback(() => {
    if (needsRenderUpdate) {
      setNeedsRenderUpdate(false);
      console.log("redraw");
      pixiOverlay.redraw(container);
    }
  }, [needsRenderUpdate]);

  useEffect(() => {
    const ticker = PIXI.Ticker.shared;
    ticker.autoStart = true;
    ticker.add(renderStage);
    window.addEventListener("__REACT_PIXI_REQUEST_RENDER__", requestUpdate);

    return () => {
      ticker.remove(renderStage);
      window.removeEventListener(
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

    console.log("render children", children);
    root.render(provider);
  }, [children]);
}

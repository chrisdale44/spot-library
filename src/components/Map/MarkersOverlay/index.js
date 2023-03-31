import React, { useContext, useRef, useMemo } from "react";
import classNames from "classnames";
import Marker from "../Marker";
import { PixiContext } from "../../../utils/middleware/ReactLeafletReactPixi";
import { calcScaleFactor } from "../../../utils/calcScaleFactor";
import styles from "../PopupContent/PopupContent.module.scss";

let cx = classNames.bind(styles);

const MarkersOverlay = ({ spots }) => {
  const { latLngToLayerPoint, scale } = useContext(PixiContext);
  const stateRef = useRef();

  stateRef.scaleFactor = useMemo(() => calcScaleFactor(scale), [scale]);

  return (
    <>
      {spots.length && latLngToLayerPoint
        ? spots.map((spot, i) => {
            const { x, y } = latLngToLayerPoint(spot.coordinates);
            // const hasImages = !!images.length;
            // const popupClassName = cx({
            //   "has-images": hasImages,
            //   [styles.hasImages]: hasImages,
            // });

            return (
              <Marker
                key={i}
                x={x}
                y={y}
                iconColor="#187bcd"
                scaleFactor={stateRef.scaleFactor}
                spot={spot}
              />
            );
          })
        : null}
    </>
  );
};

export default MarkersOverlay;

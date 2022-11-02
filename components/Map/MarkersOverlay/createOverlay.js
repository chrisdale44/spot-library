import L from "leaflet";
import * as PIXI from "pixi.js";

const createOverlay = ({ map, container, loader, markers }) => {
  const drawContainer = (_, resources) => {
    const doubleBuffering =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    let firstDraw = true;
    let prevZoom;
    let frame = null;

    const overlay = L.pixiOverlay(
      // draw overlay callback
      (utils) => {
        console.log("redraw");

        if (frame) {
          cancelAnimationFrame(frame);
          frame = null;
        }

        const renderer = utils.getRenderer();
        let project = utils.latLngToLayerPoint;
        const scale = utils.getScale();
        const zoom = map.getZoom();

        if (firstDraw) {
          console.log("first draw");
          map.on("click", (e) => {
            console.log("click handler");
            const interaction = renderer.plugins.interaction;
            const pointerEvent = e.originalEvent;
            const pixiPoint = new PIXI.Point();
            // get global click position in pixiPoint:
            interaction.mapPositionToPoint(
              pixiPoint,
              pointerEvent.clientX,
              pointerEvent.clientY
            );
            // get what is below the click if any:
            const target = interaction.hitTest(pixiPoint, container);
            if (target && target.popup) {
              target.popup.openOn(map);
            }
          });

          container.children.forEach((child) => child.scale.set(1 / scale));

          markers.forEach((marker) => {
            const {
              id,
              iconColor,
              iconId,
              onClick,
              position,
              popupContent,
              popupClick,
              tooltip,
              tooltipOptions,
              markerSpriteAnchor,
              angle,
            } = marker;

            const resolvedIconId = iconId || iconColor;

            if (
              !resources[`marker_${resolvedIconId}`] ||
              !resources[`marker_${resolvedIconId}`].texture
            ) {
              return;
            }

            const markerTexture = resources[`marker_${resolvedIconId}`].texture;
            markerTexture.anchor = { x: 0.5, y: 1 };

            const markerSprite = PIXI.Sprite.from(markerTexture);
            if (markerSpriteAnchor) {
              markerSprite.anchor.set(
                markerSpriteAnchor[0],
                markerSpriteAnchor[1]
              );
            } else {
              markerSprite.anchor.set(0.5, 1);
            }

            const markerCoords = project(position);
            markerSprite.x = markerCoords.x;
            markerSprite.y = markerCoords.y;

            if (angle) {
              markerSprite.angle = angle;
            }

            markerSprite.scale.set(1 / scale);
            markerSprite.currentScale = 1 / scale;
            markerSprite.defaultCursor = "pointer";
            markerSprite.buttonMode = true;

            if (popupContent || onClick || tooltip) {
              markerSprite.interactive = true;
            }

            if (popupContent) {
              const popupHtml = L.DomUtil.create("div", "content");
              popupHtml.innerHTML = popupContent;

              markerSprite.popup = L.popup({
                id,
                offset: [0, -28],
                autoClose: false,
              })
                .setLatLng(position)
                .setContent(popupHtml);

              if (popupClick) {
                L.DomEvent.addListener(popupHtml, "click", () => {
                  popupClick(id);
                });
              }
            }

            if (tooltip) {
              markerSprite.tooltip = L.tooltip({
                id,
                offset: [0, -35],
                position,
                content: tooltip,
                tooltipOptions: tooltipOptions || {},
              })
                .setLatLng(position)
                .setContent(tooltip)
                .openOn(map);
            }

            if (onClick) markerSprite.on("click", onClick);

            container.addChild(markerSprite);
          });
        }

        if (firstDraw || prevZoom !== zoom) {
          console.log("when does this happen?");
          for (let i = 0; i < container.children.length; i++) {
            const child = container.children[i];
            child.currentScale = child.scale.x;
            child.targetScale = 1 / scale;
          }
        }

        const duration = 100;
        let start;
        const animate = (timestamp) => {
          var progress;
          if (start === null) start = timestamp;
          progress = timestamp - start;
          var lambda = progress / duration;
          if (lambda > 1) lambda = 1;
          lambda = lambda * (0.4 + lambda * (2.2 + lambda * -1.6));
          for (let i = 0; i < container.children.length; i++) {
            const child = container.children[i];
            child.scale.set(
              child.currentScale +
                lambda * (child.targetScale - child.currentScale)
            );
          }
          renderer.render(container);
          if (progress < duration) {
            frame = requestAnimationFrame(animate);
          }
        };

        if (!firstDraw && prevZoom !== zoom) {
          console.log("zoom");
          start = null;
          frame = requestAnimationFrame(animate);
        }

        prevZoom = zoom;
        firstDraw = false;
        renderer.render(container);
      },
      container,
      {
        doubleBuffering: doubleBuffering,
        autoPreventDefault: false,
      }
    );

    overlay.addTo(map);
  };

  loader.load(drawContainer);
};

export default createOverlay;

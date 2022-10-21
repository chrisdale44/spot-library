import { useEffect } from "react";
//leaflet
import L from "leaflet";

//pixi-overlay
import * as PIXI from "pixi.js";
import "leaflet-pixi-overlay";

// react-leaflet
import { useMap } from "react-leaflet";

PIXI.settings.FAIL_IF_MAJOR_PERFORMANCE_CAVEAT = false;
PIXI.utils.skipHello();
const PIXILoader = PIXI.Loader.shared;

const getDefaultIcon = (color) => {
  const svgIcon = `<svg style="-webkit-filter: drop-shadow( 1px 1px 1px rgba(0, 0, 0, .4));filter: drop-shadow( 1px 1px 1px rgba(0, 0, 0, .4));" xmlns="http://www.w3.org/2000/svg" fill="${color}" width="36" height="36" viewBox="0 0 24 24"><path d="M12 0c-4.198 0-8 3.403-8 7.602 0 6.243 6.377 6.903 8 16.398 1.623-9.495 8-10.155 8-16.398 0-4.199-3.801-7.602-8-7.602zm0 11c-1.657 0-3-1.343-3-3s1.342-3 3-3 3 1.343 3 3-1.343 3-3 3z"/></svg>`;
  return getEncodedIcon(svgIcon);
};

const getEncodedIcon = (svg) => {
  const decoded = unescape(encodeURIComponent(svg));
  const base64 = btoa(decoded);
  return `data:image/svg+xml;base64,${base64}`;
};

const loadSprite = async (marker) => {
  return new Promise((resolve, reject) => {
    if (!marker.iconColor && !marker.iconId) resolve();
    const resolvedMarkerId = marker.iconId || marker.iconColor;
    if (PIXILoader.resources[`marker_${resolvedMarkerId}`]) resolve();

    PIXILoader.add(
      `marker_${resolvedMarkerId}`,
      marker.customIcon
        ? getEncodedIcon(marker.customIcon)
        : getDefaultIcon(marker.iconColor)
    );

    PIXILoader.onComplete.add(() => {
      resolve();
    });

    PIXILoader.onError.add(() => {
      reject();
    });
  });
};

const createOverlay = (pixiContainer, markers, map) => {
  pixiContainer.interactive = true;
  pixiContainer.buttonMode = true;

  PIXILoader.load(function (loader, resources) {
    (function () {
      const doubleBuffering =
        /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      let firstDraw = true;
      let prevZoom;
      let frame = null;

      const overlay = L.pixiOverlay(
        (utils) => {
          if (frame) {
            cancelAnimationFrame(frame);
            frame = null;
          }
          // redraw callback

          var container = utils.getContainer();
          var renderer = utils.getRenderer();
          let project = utils.latLngToLayerPoint;
          var scale = utils.getScale();
          var zoom = map.getZoom();

          if (firstDraw) {
            map.on("click", function (e) {
              var interaction = renderer.plugins.interaction;
              var pointerEvent = e.originalEvent;
              var pixiPoint = new PIXI.Point();
              // get global click position in pixiPoint:
              interaction.mapPositionToPoint(
                pixiPoint,
                pointerEvent.clientX,
                pointerEvent.clientY
              );
              // get what is below the click if any:
              var target = interaction.hitTest(pixiPoint, container);
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
                popup,
                tooltip,
                tooltipOptions,
                //popupOpen, todo: start with popup open
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

              const markerTexture =
                resources[`marker_${resolvedIconId}`].texture;
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

              if (popup || onClick || tooltip) {
                markerSprite.interactive = true;
              }

              if (popup) {
                markerSprite.popup = L.popup({
                  id,
                  offset: [0, -35],
                  position,
                  content: popup,
                  onClick,
                  autoClose: false,
                })
                  .setLatLng(position)
                  .setContent(popup);
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
            start = null;
            frame = requestAnimationFrame(animate);
          }

          firstDraw = false;
          prevZoom = zoom;
          renderer.render(container);
        },
        pixiContainer,
        {
          doubleBuffering: doubleBuffering,
          autoPreventDefault: false,
        }
      );

      overlay.addTo(map);
    })();
  });
};

const PixiOverlay = ({ markers }) => {
  const map = useMap();

  useEffect(() => {
    const loadSprites = async (markers) => {
      // cancel loading if already loading as it may cause: Error: Cannot add resources while the loader is running.
      if (PIXILoader.loading) {
        PIXILoader.reset();
      }

      await Promise.all(markers.map(async (marker) => loadSprite(marker)));
    };

    // load sprites
    loadSprites(markers).catch(console.error);

    // create overlay container
    const pixiContainer = new PIXI.Container();
    createOverlay(pixiContainer, markers, map);

    return () => pixiContainer.removeChildren();
  }, [markers]);
};

export default PixiOverlay;

import L from "leaflet";
import * as PIXI from "pixi.js";

const createLeafletOverlay = ({
  map,
  container,
  loader,
  allMarkers,
  setLeafletOverlay,
}) => {
  const loadLeafletOverlay = (_, resources) => {
    const loadOptions = {
      doubleBuffering:
        /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream,
      autoPreventDefault: false,
    };
    let firstDraw = true;
    let prevZoom;
    let frame = null;

    const leafletOverlay = L.pixiOverlay(
      // draw overlay callback
      (utils, eventOrData) => {
        console.log("redraw", eventOrData);
        let markers = allMarkers;
        if (!eventOrData.type) {
          markers = eventOrData;

          for (let i = 0; i < container.children.length; i++) {
            const child = container.children[i];
            // todo: child.id is undefined
            if (
              markers.some((marker) => marker.id === child.popup.options.id)
            ) {
              console.log("hide marker", child.popup.options.id);
              // child.visible = false;
              // child.parent.removeChild(child);
            } else {
              console.log("show marker", child.popup.options.id);
              // child.visible = true;
            }
          }

          // firstDraw = true;
          // console.log("redraw triggered: removeChildren");
          // container.removeChildren(0, allMarkers.length - 1);
        }

        const createMarker = ({
          id,
          iconColor,
          onClick,
          position,
          popupContent,
          popupClick,
          tooltip,
          tooltipOptions,
          markerSpriteAnchor,
          angle,
        }) => {
          if (!resources[`marker_${iconColor}`]?.texture) {
            return;
          }

          // Create PixiJS Marker of given icon
          const markerTexture = resources[`marker_${iconColor}`].texture;
          markerTexture.id = id; // todo: set id on Sprite somehow?
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

          // Set Marker position
          const markerCoords = project(position);
          markerSprite.x = markerCoords.x;
          markerSprite.y = markerCoords.y;

          if (angle) {
            markerSprite.angle = angle;
          }

          // Set Marker scale
          markerSprite.scale.set(1 / scale);
          markerSprite.currentScale = 1 / scale;
          markerSprite.defaultCursor = "pointer";
          markerSprite.buttonMode = true;

          if (popupContent || onClick || tooltip) {
            markerSprite.interactive = true;
          }

          // Set popup
          if (popupContent) {
            const popupHtml = L.DomUtil.create("div", "content");
            popupHtml.innerHTML = popupContent;

            markerSprite.popup = L.popup({
              id,
              offset: [0, -28],
              autoClose: false,
              closeButton: false, // todo: debug why close button takes two clicks
            })
              .setLatLng(position)
              .setContent(popupHtml);

            if (popupClick) {
              L.DomEvent.addListener(popupHtml, "click", () => {
                popupClick(id);
              });
            }
          }

          // Set tooltip
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

          // Set onClick
          if (onClick) markerSprite.on("click", onClick);

          // Add Sprite to Container
          container.addChild(markerSprite);
        };

        if (frame) {
          cancelAnimationFrame(frame);
          frame = null;
        }

        const renderer = utils.getRenderer();
        const project = utils.latLngToLayerPoint;
        const scale = utils.getScale();
        const zoom = map.getZoom();

        const mapClickHandler = (e) => {
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
        };

        if (firstDraw) {
          console.log("first draw");
          map.on("click", mapClickHandler);
          container.children.forEach((child) => child.scale.set(1 / scale));
          markers.forEach(createMarker);
        }

        if (firstDraw || prevZoom !== zoom) {
          console.log("first draw OR zoom");
          // Reset all markers scale
          for (let i = 0; i < container.children.length; i++) {
            const child = container.children[i];
            child.currentScale = child.scale.x;
            child.targetScale = 1 / scale;
          }
        }

        const duration = 100;
        let start;
        // Animation util
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
          console.log("not first draw AND zoom");
          start = null;
          // Animate scale when zooming
          frame = requestAnimationFrame(animate);
        }

        prevZoom = zoom;
        firstDraw = false;
        container.resolution = 1;
        renderer.render(container);
      },
      container,
      loadOptions
    );

    leafletOverlay.addTo(map); // add Pixi container as a Leaflet overlay
    setLeafletOverlay(leafletOverlay);
  };

  loader.load(loadLeafletOverlay);
};

export default createLeafletOverlay;

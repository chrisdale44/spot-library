import classNames from "classnames";
import styles from "./PopupContent/PopupContent.module.scss";

let cx = classNames.bind(styles);

// todo: find better way of importing svg's to pixiJS
export const getDefaultIcon = (color) => {
  const svgIcon = `
    <svg 
      style="-webkit-filter: drop-shadow( 1px 1px 1px rgba(0, 0, 0, .4));filter: drop-shadow( 1px 1px 1px rgba(0, 0, 0, .4));"
      xmlns="http://www.w3.org/2000/svg"
      width="36"
      height="36"
      viewBox="0 0 24 24"
      fill="${color}"
    >
      <path d="M12 0c-4.198 0-8 3.403-8 7.602 0 6.243 6.377 6.903 8 16.398 1.623-9.495 8-10.155 8-16.398 0-4.199-3.801-7.602-8-7.602zm0 11c-1.657 0-3-1.343-3-3s1.342-3 3-3 3 1.343 3 3-1.343 3-3 3z" />
    </svg>
  `;
  return getEncodedIcon(svgIcon);
};

export const getStreetViewIcon = (color) => {
  const svgIcon = `<svg
    stroke-width="0"
    viewBox="0 0 24 24"
    height="30"
    width="30"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill="none"
      stroke="${color}"
      stroke-width="2"
      d="M16,5 C16,7.209 14.209,9 12,9 C9.791,9 8,7.209 8,5 C8,2.791 9.791,1 12,1 C14.209,1 16,2.791 16,5 L16,5 Z M15,23 L15,17 L18,17 L18,15 C18,11.66 15.24,9.03 12,9 C8.79,9.03 6,11.66 6,15 L6,17 L9,17 L9,23 M3.5,23 L20.5,23 L3.5,23 Z"
    ></path>
  </svg>`;
  return getEncodedIcon(svgIcon);
};

export const getCrosshairsIcon = (color) => {
  const svgIcon = `
    <svg stroke="currentColor" fill="${color}" stroke-width="0" viewBox="0 0 24 24" height="30" width="30" xmlns="http://www.w3.org/2000/svg">
      <path fill="none" d="M0 0h24v24H0V0z"></path>
      <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3A8.994 8.994 0 0013 3.06V1h-2v2.06A8.994 8.994 0 003.06 11H1v2h2.06A8.994 8.994 0 0011 20.94V23h2v-2.06A8.994 8.994 0 0020.94 13H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"></path>
    </svg>
  `;
  return getEncodedIcon(svgIcon);
};

export const getIconFromSvg = (svg) => {
  const svgString = jsxToString(svg);
  return getEncodedIcon(svgString);
};

export const getEncodedIcon = (svg) => {
  const decoded = unescape(encodeURIComponent(svg));
  const base64 = btoa(decoded);
  return `data:image/svg+xml;base64,${base64}`;
};

export const calcOffset = (scaleFactor) => {
  const markerHeight = 36;
  const fixedOffset = 10;
  return -(scaleFactor * markerHeight - fixedOffset);
};

export const getPopupClassNames = (spot) => {
  if (!Object.keys(spot).length) {
    return "";
  }
  const hasImages = !!spot.images.length;
  return cx({
    "has-images": hasImages,
    [styles.hasImages]: hasImages,
  });
};

import classNames from "classnames";
import styles from "./PopupContent/PopupContent.module.scss";
let cx = classNames.bind(styles);

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

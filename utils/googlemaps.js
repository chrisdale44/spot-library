export const getStreetViewLink = (coords) =>
  `http://maps.google.com/maps?q=&layer=c&cbll=${coords[0]},${coords[1]}&cbp=11,0,0,0,0`;

export const getMapsLink = (coords) =>
  `http://maps.google.com/maps?q=${coords[0]},${coords[1]}`;

// Markers get exponentially less small after scale of 8
export const calcScaleFactor = (scale) =>
  scale > 8 ? 1 : 1 - Math.abs((Math.log2(scale / 8) - 1) * 0.05);

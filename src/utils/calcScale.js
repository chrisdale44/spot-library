const calcScale = (scale) => {
  // Markers get exponentially less small after scale of 8
  const factor =
    scale > 8 ? 1 : 1 - Math.abs((Math.log2(scale / 8) - 1) * 0.05);

  return factor / scale;
};

export default calcScale;

export const parseSpot = (spot) => ({
  ...spot,
  images: spot.images ? JSON.parse(spot.images) : [],
  media: spot.media ? JSON.parse(spot.media) : [],
});

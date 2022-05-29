export const filterSpotsById = (spots, payload) =>
  spots.filter(({ id }) => {
    console.log(id, payload);
    return id === parseInt(payload);
  });

export const filterSpotsByTitle = (spots, payload) =>
  spots.filter(({ name }) =>
    name?.toLowerCase().includes(payload.toLowerCase())
  );

export const filterSpotsWithImage = (spots) =>
  spots.filter(({ images }) => images.length);

export const filterSpotsWithoutImage = (spots) =>
  spots.filter(({ images }) => !images.length);

export const filterSpotsByTag = (spots, payload) => {
  if (!payload.length) {
    return spots;
  }
  return spots.filter((spot) =>
    spot.tags.find((tag) => payload.includes(tag.id))
  );
};

export const filterSpots = (spots, selectedFilters) => {
  let filteredSpots = [...spots];
  selectedFilters.forEach(({ id, payload }) => {
    switch (id) {
      case "imagesToggle":
        filteredSpots = filterSpotsWithImage(filteredSpots);
        break;
      case "noImagesToggle":
        filteredSpots = filterSpotsWithoutImage(filteredSpots);
        break;
      case "searchFilter":
        if (payload.id) {
          filteredSpots = filterSpotsById(filteredSpots, payload.id);
        } else if (payload.name) {
          filteredSpots = filterSpotsByTitle(filteredSpots, payload.name);
        }
        break;
    }
  });
  return filteredSpots;
};

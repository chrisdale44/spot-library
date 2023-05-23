export const getUserLatLng = async () => {
  const pos = await new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      timeout: 10000,
      enableHighAccuracy: true,
    });
  });

  return { lat: pos.coords.latitude, lng: pos.coords.longitude };
};

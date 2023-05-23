import React from "react";
import Control from "react-leaflet-custom-control";
import { useRecoilState } from "recoil";
import { MdOutlineMyLocation } from "react-icons/md";
import { userLocationState } from "../../../../../state";
import { getUserLatLng } from "../../../../Map/UserLocationIcon/utils";

const UserLocation = () => {
  const [userLocation, setUserLocation] = useRecoilState(userLocationState);

  const handleUserLocation = async (e) => {
    if (userLocation) {
      setUserLocation(null);
    } else {
      setUserLocation(await getUserLatLng());
    }
  };

  return (
    <Control position="topleft">
      <button type="button" onClick={handleUserLocation}>
        <MdOutlineMyLocation />
      </button>
    </Control>
  );
};

export default UserLocation;

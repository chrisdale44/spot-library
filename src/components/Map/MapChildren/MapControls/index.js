import React from "react";
// import SearchField from "./SearchField";
import AddNewSpot from "./AddNewSpot";
import StreetView from "./StreetView";
import UserLocation from "./UserLocation";

const MapControls = () => {
  return (
    <>
      {/* <AddNewSpot /> */}
      <UserLocation />
      <StreetView />
    </>
  );
};

export default MapControls;

import React from "react";
import SpotForm from "../../Forms/SpotForm";

const EditSpot = ({ spot }) => {
  return (
    <SpotForm
      latlng={{ lat: spot.coordinates[0], lng: spot.coordinates[1] }}
      id={spot.id}
      spot={spot}
      relocatePin={() => {}}
    />
  );
};

export default EditSpot;

import React from "react";
import { useRecoilState } from "recoil";
import SpotForm from "../../Forms/SpotForm";
import RelocateMarkerDialog from "../../Modal/Dialog/RelocateMarker";
import { modalState } from "../../../state";

const EditSpot = ({ spot, latLng, relocateMarker, scaleFactor }) => {
  const { id } = spot;
  const [, setModal] = useRecoilState(modalState);

  const handleExifLocationMismatch = (newCoordinates) => {
    setModal(
      <RelocateMarkerDialog
        latLng={newCoordinates}
        relocateMarker={relocateMarker}
      />
    );
  };

  return (
    <SpotForm
      id={id}
      spot={spot}
      latlng={latLng}
      scaleFactor={scaleFactor}
      handleExifLocationMismatch={handleExifLocationMismatch}
    />
  );
};

export default EditSpot;

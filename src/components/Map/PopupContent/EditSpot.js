import React from "react";
import SpotForm from "../../Forms/SpotForm";

const EditSpot = ({ spot }) => {
  const [popup, setPopup] = useRecoilState(popupState);

  return (
    <SpotForm
      latlng={{ lat: spot.coordinates[0], lng: spot.coordinates[1] }}
      id={id}
      spot={spot}
      relocatePin={relocatePin}
    />
  );
};

export default EditSpot;

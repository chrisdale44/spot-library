import React from "react";
import Dialog from ".";

const RelocateMarker = ({ latLng, relocateMarker }) => (
  <Dialog yesCallback={() => relocateMarker(latLng)}>
    <p>Image was taken at different location to pin.</p>
    <p>Do you want to relocate the pin?</p>
  </Dialog>
);

export default RelocateMarker;

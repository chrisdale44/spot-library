import React from "react";
import { InView } from "react-intersection-observer";

const Sentinel = ({ onChange }) => (
  <InView
    onChange={(inView) => {
      if (inView) onChange();
    }}
  >
    {({ ref }) => <div ref={ref} />}
  </InView>
);

export default Sentinel;

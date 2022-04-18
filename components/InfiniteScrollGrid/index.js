import React, { useState, useEffect } from "react";
import chunk from "lodash.chunk";
import PropTypes from "prop-types";
import Tile from "./Tile";
import Sentinel from "../Sentinel";

const InfiniteScrollGrid = ({ items, chunkSize }) => {
  const [chunkIndex, setChunkIndex] = useState(0);
  const [chunkedSpots, setChunkedSpots] = useState([]);
  const [displayedSpots, setDisplayedSpots] = useState([]);

  useEffect(() => {
    if (!chunkedSpots.length) {
      return;
    }

    if (chunkIndex === 0) {
      setDisplayedSpots(chunkedSpots[chunkIndex]);
    } else {
      setDisplayedSpots((curr) => curr.concat(chunkedSpots[chunkIndex]));
    }
  }, [chunkIndex, chunkedSpots]);

  useEffect(() => {
    setChunkIndex(0);
    setChunkedSpots(chunk(items, chunkSize));
  }, [items, chunkSize]);

  if (!items) {
    return null;
  }

  const handleInfiniteScroll = () => {
    if (chunkIndex < chunkedSpots.length - 1) {
      setChunkIndex(chunkIndex + 1);
    }
  };

  const grid = displayedSpots.map((item, i) => <Tile key={i} item={item} />);
  grid.push(<Sentinel key={"s"} onChange={handleInfiniteScroll} />);
  return grid;
};

InfiniteScrollGrid.propTypes = {
  content: PropTypes.arrayOf(PropTypes.object),
};

export default InfiniteScrollGrid;
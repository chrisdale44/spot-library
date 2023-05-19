import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import dynamic from "next/dynamic";
import {
  spotsState,
  tagsState,
  selectedFiltersState,
  filteredSpotsState,
} from "../state";
import { filterSpots } from "../state/filters/utils";
import PageTemplate from "../components/PageTemplate";
import InfiniteScrollGrid from "../components/InfiniteScrollGrid";
import { getRandomCoordInRange } from "../utils";
import styles from "../styles/Home.module.scss";

// do not load Leaflet map on server as it uses window object
const Map = dynamic(() => import("../components/Map/index"), { ssr: false });

function Home() {
  // todo: minimise usage of useRecoil state in components by writing more actions
  const [spots] = useRecoilState(spotsState);
  const [selectedFilters] = useRecoilState(selectedFiltersState);
  const [filteredSpots, setFilteredSpots] = useRecoilState(filteredSpotsState);

  useEffect(() => {
    console.log(spots);
    setFilteredSpots(filterSpots(spots, selectedFilters));
  }, [spots, selectedFilters]);

  return (
    <PageTemplate>
      <Map id="map" spots={filteredSpots} />

      <div id="grid" className={styles.gridContainer}>
        <InfiniteScrollGrid items={filteredSpots} chunkSize={50} />
      </div>
    </PageTemplate>
  );
}

function StateHandler({ spots, tags }) {
  const [, setSpots] = useRecoilState(spotsState);
  const [, setTagsState] = useRecoilState(tagsState);

  useEffect(() => {
    setSpots(spots);
    setTagsState(tags);
  }, [setSpots, spots]);

  return <Home />;
}

export const getStaticProps = async () => {
  try {
    const spotsArray = [];
    const tagsArray = [
      { id: 1, name: "tag 1" },
      { id: 2, name: "tag 2" },
    ];

    for (let i = 0; i < 5000; i++) {
      const randomLat = getRandomCoordInRange(-1.5, 1.2, 5);
      const randomLang = getRandomCoordInRange(50.7, 52.3, 5);

      spotsArray.push({
        id: i,
        name: `Spot #${i}`,
        coordinates: [randomLang, randomLat],
        images: [],
        tags: [i % 2 ? 1 : 2],
      });
    }

    return {
      props: {
        spots: spotsArray,
        tags: tagsArray,
      },
      revalidate: 60,
    };
  } catch (e) {
    console.error(e);
    return {
      props: {},
    };
  }
};

export default StateHandler;

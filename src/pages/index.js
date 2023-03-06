import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import dynamic from "next/dynamic";
import { spotsState, tagsState, selectedFiltersState } from "../state";
import { filterSpots } from "../state/filters/utils";
import PageTemplate from "../components/PageTemplate";
import InfiniteScrollGrid from "../components/InfiniteScrollGrid";
import styles from "../styles/Home.module.scss";

// do not load Leaflet map on server as it uses window object
const Map = dynamic(() => import("../components/Map/index"), { ssr: false });

function Home() {
  const [spots] = useRecoilState(spotsState);
  const [selectedFilters] = useRecoilState(selectedFiltersState);
  const [filteredSpots, setFilteredSpots] = useState(
    filterSpots(spots, selectedFilters)
  );

  useEffect(() => {
    setFilteredSpots(filterSpots(spots, selectedFilters));
  }, [spots, selectedFilters]);

  return (
    <PageTemplate filteredSpots={filteredSpots}>
      <Map id="map" spots={filteredSpots} />

      <div id="grid" className={styles.gridContainer}>
        <InfiniteScrollGrid items={filteredSpots} chunkSize={50} />
      </div>
    </PageTemplate>
  );
}

function StateHandler({ spots }) {
  const [, setSpots] = useRecoilState(spotsState);
  const [, setTagsState] = useRecoilState(tagsState);

  useEffect(() => {
    setSpots(spots);
    setTagsState();
  }, [setSpots, spots]);

  return <Home />;
}

export async function getStaticProps() {
  try {
    const response = await fetch(process.env.API_DOMAIN + "/api/spots/read", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
    const spots = await response.json();

    if (!response.ok || response.status !== 200) {
      console.error("API request failed");
      return {
        props: {},
      };
    }
    console.log("API request successful");
    return {
      props: {
        spots,
      },
    };
  } catch (e) {
    console.error(e);
    return {
      props: {},
    };
  }
}

export default StateHandler;

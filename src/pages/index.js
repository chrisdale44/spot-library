import { useEffect } from "react";
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
import styles from "../styles/Home.module.scss";

// do not load Leaflet map on server as it uses window object
const Map = dynamic(() => import("../components/Map/index"), { ssr: false });

function Home() {
  const [spots] = useRecoilState(spotsState);
  const [selectedFilters] = useRecoilState(selectedFiltersState);
  const [filteredSpots, setFilteredSpots] = useRecoilState(filteredSpotsState);

  useEffect(() => {
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
    const spotsResponse = await fetch(
      process.env.API_DOMAIN + "/api/spots/read",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      }
    );
    const spots = await spotsResponse.json();

    if (!spotsResponse.ok || spotsResponse.status !== 200) {
      console.error("API request failed: /api/spots/read");
      return {
        props: {},
      };
    }

    const tagsResponse = await fetch(
      process.env.API_DOMAIN + "/api/tags/read",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      }
    );
    const tags = await tagsResponse.json();

    if (!tagsResponse.ok || tagsResponse.status !== 200) {
      console.error("API request failed: /api/tags/read");
      return {
        props: {},
      };
    }

    console.log("API requests successful");
    return {
      props: {
        spots,
        tags,
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

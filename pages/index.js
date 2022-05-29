import { useEffect } from "react";
import { useRecoilState } from "recoil";
import {
  spotsState,
  toastState,
  tagsState,
  selectedFiltersState,
} from "../state";
import { filterSpots } from "../state/filters/utils";
import PageTemplate from "../components/PageTemplate";
// import Map from "../components/Map";
import InfiniteScrollGrid from "../components/InfiniteScrollGrid";
import styles from "../styles/Home.module.scss";

function Home() {
  const [, setToast] = useRecoilState(toastState);
  const [spots] = useRecoilState(spotsState);
  const [selectedFilters] = useRecoilState(selectedFiltersState);
  const filteredSpots = filterSpots(spots, selectedFilters);
  return (
    <PageTemplate filteredSpots={filteredSpots}>
      {/* <Map id="map" spots={spots} /> */}

      <div id="grid" className={styles.gridContainer}>
        <button
          onClick={() => {
            setToast({ type: "success", message: "Success" });
          }}
        >
          Toast
        </button>
        {spots && (
          <p>
            Displaying: {filteredSpots.length} of {spots.length} spots
          </p>
        )}
        <InfiniteScrollGrid items={filteredSpots} chunkSize={50} />
      </div>
      <div id="map">Tets</div>
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

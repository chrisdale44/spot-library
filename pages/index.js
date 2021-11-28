import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { spotsState } from "../state";
import PageTemplate from "../components/PageTemplate";
// import Map from "../components/Map";
import InfiniteScrollGrid from "../components/InfiniteScrollGrid";
import styles from "../styles/Home.module.scss";

function Home({ spots }) {
  return (
    <PageTemplate>
      {/* <Map id="map" spots={spots} /> */}

      <div id="grid" className={styles.gridContainer}>
        {spots && <p>Displaying: {spots.length} spots</p>}
        <InfiniteScrollGrid items={spots} chunkSize={50} />
      </div>
      <div id="map">Tets</div>
    </PageTemplate>
  );
}

function StateHandler({ spots: staticSpots }) {
  const [spots, setSpots] = useRecoilState(spotsState);

  useEffect(() => {
    setSpots(staticSpots);
  }, [setSpots, staticSpots]);

  return <Home spots={spots.length ? spots : staticSpots} />;
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
      return {};
    }
    return {
      props: {
        spots,
      },
    };
  } catch (e) {
    console.error(e);
    return {};
  }
}

export default StateHandler;

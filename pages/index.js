import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { spotsState } from "../state";

function SpotsList({ spots }) {
  return (
    <ul>
      {spots.map(({ id, name }) => (
        <li key={id}>{name}</li>
      ))}
    </ul>
  );
}

function Home({ spots: staticSpots }) {
  const [spots, setSpots] = useRecoilState(spotsState);

  useEffect(() => {
    setSpots(staticSpots);
  }, []);

  return <SpotsList spots={spots.length ? spots : staticSpots} />;
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

export default Home;

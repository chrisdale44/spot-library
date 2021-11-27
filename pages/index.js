import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { spotsState } from "../state";

function Home({ spotsData }) {
  const [spots, setSpots] = useRecoilState(spotsState);

  useEffect(() => {
    setSpots(spotsData);
  }, [spotsData]);

  return (
    <div>
      {spots && (
        <ul>
          {spots.map(({ id, name }) => (
            <li key={id}>{name}</li>
          ))}
        </ul>
      )}
    </div>
  );
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
    const spotsData = await response.json();

    if (!response.ok || response.status !== 200) {
      return {};
    }
    return {
      props: {
        spotsData,
      },
    };
  } catch (e) {
    console.error(e);
    return {};
  }
}

export default Home;

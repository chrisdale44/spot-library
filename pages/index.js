// import { useRecoilState, useRecoilValue } from "recoil";
import useSWR, { useSWRConfig } from "swr";
// import styles from "../styles/Home.module.css";

// const fetcher = () =>
// fetch("/api/spots/get").then((response) => response.json());

function Home({ spots }) {
  // const { mutate } = useSWRConfig();
  // const { data: spots } = useSWR("/api/spots/get", fetcher);

  // const tags = useRecoilValue(tags);
  // const spots = useRecoilValue(spots);

  // useEffect(() => {
  //   let total = 0;
  //   if (spots) {
  //     spots.forEach((spot) => {
  //       if (spot.images?.length) {
  //         total++;
  //       }
  //     });
  //     console.log(`${total} spots with images`);
  //   }
  // }, [spots]);

  return (
    <div>
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          const { name, description } = event.target;

          await fetch("/api/spots/create", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              spots: [
                {
                  name: name.value,
                  description: description.value,
                },
              ],
            }),
          });
          // mutate("/api/spots/get");
        }}
      >
        <input name="name" />
        <input name="description" />
        <button type="submit">Submit</button>
      </form>

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
  // const tags = await fetch("/api/tags/get", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({}),
  // });
  const response = await fetch(process.env.API_DOMAIN + "/api/spots/read", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });
  const spots = await response.json();

  return {
    props: {
      // tags,
      spots,
    },
  };
}

export default Home;

import dynamic from "next/dynamic";
import ErrorBoundary from "../components/ErrorBoundary";
import { useEffect, useState } from "react";
import { RecoilRoot } from "recoil";
import Head from "next/head";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  const [root, setRoot] = useState(null);
  let RecoilizeDebugger;
  // if (process.env.NODE_ENV === "development") {
  //   RecoilizeDebugger = dynamic(
  //     () => {
  //       return import("recoilize");
  //     },
  //     { ssr: false }
  //   );
  // }

  useEffect(() => {
    if (typeof window.document !== "undefined") {
      setRoot(document.getElementById("__next"));
    }
  }, [root]);

  return (
    <ErrorBoundary key={"1"}>
      <RecoilRoot>
        {/* {process.env.NODE_ENV === "development" && (
          <RecoilizeDebugger root={root} />
        )} */}
        <Head>
          <title>Spot Mapper</title>
        </Head>
        <Component {...pageProps} />
      </RecoilRoot>
    </ErrorBoundary>
  );
}

export default MyApp;

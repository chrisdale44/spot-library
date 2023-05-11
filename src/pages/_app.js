// import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { RecoilRoot } from "recoil";
import Head from "next/head";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  const [root, setRoot] = useState(null);
  // const RecoilizeDebugger = dynamic(
  //   () => {
  //     return import("recoilize");
  //   },
  //   { ssr: false }
  // );

  useEffect(() => {
    if (typeof window.document !== "undefined") {
      setRoot(document.getElementById("__next"));
    }
  }, [root]);

  return (
    <RecoilRoot>
      {/* <RecoilizeDebugger root={root} /> */}
      <Head>
        <title>Spot Mapper</title>
      </Head>
      <Component {...pageProps} />
    </RecoilRoot>
  );
}

export default MyApp;

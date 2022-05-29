import React from "react";
import { useRecoilState } from "recoil";
import classNames from "classnames";
import NavBar from "../NavBar";
import SpotModal from "../Modal";
import Toast from "../Toast";
import { navState } from "../../state";
import styles from "./PageTemplate.module.scss";

let cx = classNames.bind(styles);

const PageTemplate = ({ children, filteredSpots }) => {
  const [view] = useRecoilState(navState);

  return (
    <>
      <NavBar sidebar={true} filteredSpots={filteredSpots} />
      <main>
        {children.map((child, i) => {
          const {
            props: { id },
          } = child;
          return (
            <section
              key={i}
              className={cx(styles.view, { [styles.show]: view === id })}
            >
              {child}
            </section>
          );
        })}
        <Toast />
      </main>
      <SpotModal />
    </>
  );
};

export default PageTemplate;

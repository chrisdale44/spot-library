import React from "react";
import { useRecoilState } from "recoil";
import classNames from "classnames";
import NavBar from "../NavBar";
import Modal from "../Modal";
import Toast from "../Toast";
import { navState as navRecoilState } from "../../state";
import styles from "./PageTemplate.module.scss";

let cx = classNames.bind(styles);

const PageTemplate = ({ children, filteredSpots }) => {
  const [navState] = useRecoilState(navRecoilState);
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
              // Show/ hide map and grid views using CSS to prevent unnecessary renders and calls to Cloudinary
              className={cx(styles.view, { [styles.show]: navState === id })}
            >
              {child}
            </section>
          );
        })}
        <Toast />
        <Modal />
      </main>
    </>
  );
};

export default PageTemplate;

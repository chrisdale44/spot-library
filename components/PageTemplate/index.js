import React from "react";
import classNames from "classnames";
// import NavBar from "../NavBar";
import Modal from "../Modal";
import Toast from "../Toast";

import styles from "./PageTemplate.module.scss";

let cx = classNames.bind(styles);

const PageTemplate = ({ children }) => {
  // const currentView = useSelector(({ view }) => view);
  let currentView = "grid";

  return (
    <>
      {/* <NavBar sidebar={true} /> */}
      <main>
        {children.map((child, i) => {
          const {
            props: { id },
          } = child;
          return (
            <section
              key={i}
              className={cx(styles.view, { [styles.show]: currentView === id })}
            >
              {child}
            </section>
          );
        })}
        <Toast />
      </main>
      <Modal />
    </>
  );
};

export default PageTemplate;

import React, { useState } from "react";
import * as cx from "classnames";
import styles from "./Tabs.module.scss";

const tabs = [
  {
    title: "Tab 1",
    content: (
      <>
        <h2>Tab One Content</h2>
        <p>Tab content...</p>
      </>
    ),
  },
  {
    title: "Tab 2",
    content: (
      <>
        <h2>Tab Two Content</h2>
        <p>Tab content...</p>
      </>
    ),
  },
  {
    title: "Tab 3",
    content: (
      <>
        <h2>Tab Three Content</h2>
        <p>Tab content...</p>
      </>
    ),
  },
];

const Tabs = () => {
  const [checkedTab, setCheckedTab] = useState(0);

  return (
    <div className={styles.tabs}>
      {tabs.map(({ title }, i) => (
        <>
          <input
            className={styles.radiotab}
            name="tabs"
            tabindex="1"
            type="radio"
            checked={checkedTab === i ? "checked" : ""}
            id={"tab-" + i}
          />
          <label
            className={cx(styles.label, { [styles.checked]: checkedTab === i })}
            for={"tab-" + i}
            onClick={() => setCheckedTab(i)}
          >
            {title}
          </label>
        </>
      ))}
      {tabs.map(({ content }, i) => (
        <div
          className={cx(styles.panel, { [styles.checked]: checkedTab === i })}
          tabindex="1"
        >
          {content}
        </div>
      ))}
    </div>
  );
};

export default Tabs;

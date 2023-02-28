import React, { useState } from "react";
import * as cx from "classnames";
import styles from "./Tabs.module.scss";

const Tabs = ({ tabs }) => {
  const [checkedTab, setCheckedTab] = useState(0);

  return tabs?.length ? (
    <div className={styles.tabs}>
      {tabs.map(({ title }, i) => (
        <>
          <input
            className={styles.radiotab}
            name="tabs"
            tabindex="1"
            type="radio"
            defaultChecked={checkedTab === i}
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
  ) : null;
};

export default Tabs;

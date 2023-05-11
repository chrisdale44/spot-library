import React, { useState } from "react";
import * as cx from "classnames";
import styles from "./Tabs.module.scss";

const Tabs = ({ headings, children }) => {
  const [checkedTab, setCheckedTab] = useState(0);

  return headings?.length ? (
    <div className={styles.tabs}>
      <div className={styles.tabHeadings}>
        {headings.map((heading, i) => (
          <React.Fragment key={i}>
            <input
              className={styles.radiotab}
              name="tabs"
              tabIndex="1"
              type="radio"
              defaultChecked={checkedTab === i}
              id={"tab-" + i}
            />
            <label
              className={cx(styles.label, {
                [styles.checked]: checkedTab === i,
              })}
              htmlFor={"tab-" + i}
              onClick={() => setCheckedTab(i)}
            >
              {heading}
            </label>
          </React.Fragment>
        ))}
      </div>
      <div className={styles.tabContent}>
        {children.map((child, i) => (
          <div
            className={cx(styles.panel, { [styles.checked]: checkedTab === i })}
            tabIndex="1"
            key={i}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  ) : null;
};

export default Tabs;

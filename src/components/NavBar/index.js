import React, { useState } from "react";
import Link from "next/link";
import { useRecoilState } from "recoil";
import { IoFunnelSharp, IoClose } from "react-icons/io5";
import { GrMapLocation } from "react-icons/gr";
import { BsGrid3X3Gap } from "react-icons/bs";
// import { BiImageAdd } from "react-icons/bi";
import SideBarNav from "../SideBarNav";
import { navState as navRecoilState } from "../../state";
import styles from "./NavBar.module.scss";

const NavBar = ({ sidebar }) => {
  const [navState, setNavState] = useRecoilState(navRecoilState);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSideNav = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleView = () => {
    const nextView = navState === "map" ? "grid" : "map";
    setNavState(nextView);
  };

  return (
    <nav className={styles.navBar}>
      <Link href="/" passHref>
        <h1>SpotLibrary</h1>
      </Link>
      <div className={styles.iconWrapper}>
        {/* <button
          className={cx(styles.icon, styles.large)}
          type="button"
          onClick={() => {}}
        >
          <BiImageAdd />
        </button> */}

        <button className={styles.icon} type="button" onClick={toggleView}>
          {navState === "map" ? (
            <BsGrid3X3Gap view="grid" />
          ) : (
            <GrMapLocation view="map" />
          )}
        </button>
        {sidebar && (
          <button className={styles.icon} type="button" onClick={toggleSideNav}>
            {sidebarOpen ? <IoClose /> : <IoFunnelSharp />}
          </button>
        )}
      </div>
      {sidebar && <SideBarNav sidebarOpen={sidebarOpen} />}
    </nav>
  );
};

export default NavBar;

import React, { useState } from "react";
import Link from "next/link";
import { useRecoilState } from "recoil";
import { IoFunnelSharp, IoClose } from "react-icons/io5";
import { GrMapLocation } from "react-icons/gr";
import { BsGrid3X3Gap } from "react-icons/bs";
import SideBarNav from "../SideBarNav";
import { navState } from "../../state";
import styles from "./NavBar.module.scss";

const NavBar = ({ sidebar, filteredSpots }) => {
  const [view, setnavState] = useRecoilState(navState);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSideNav = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleView = () => {
    const nextView = view === "map" ? "grid" : "map";
    setnavState(nextView);
  };

  return (
    <nav className={styles.navBar}>
      <Link href="/" passHref>
        <h1>SpotMapper</h1>
      </Link>
      <div className={styles.iconWrapper}>
        <button className={styles.icon} type="button" onClick={toggleView}>
          {view === "map" ? (
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
      {sidebar && (
        <SideBarNav sidebarOpen={sidebarOpen} filteredSpots={filteredSpots} />
      )}
    </nav>
  );
};

export default NavBar;

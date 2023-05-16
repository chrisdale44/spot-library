import React, { useState } from "react";
import Link from "next/link";
import { useRecoilState } from "recoil";
import { IoFunnelSharp, IoClose } from "react-icons/io5";
import { GrMapLocation, GrStreetView } from "react-icons/gr";
import { BsGrid3X3Gap } from "react-icons/bs";
// import { BiImageAdd } from "react-icons/bi";
import { MdOutlineMyLocation } from "react-icons/md";
import { RiMapPinAddFill } from "react-icons/ri";
import classNames from "classnames";
import SideBarNav from "../SideBarNav";
import {
  navState as navRecoilState,
  mapState as mapRecoilState,
  userLocationState,
} from "../../state";
import { getUserLatLng } from "../Map/UserLocation/utils";
import styles from "./NavBar.module.scss";

let cx = classNames.bind(styles);

const NavBar = ({ sidebar }) => {
  const [navState, setNavState] = useRecoilState(navRecoilState);
  const [mapState, setMapState] = useRecoilState(mapRecoilState);
  const [userLocation, setUserLocation] = useRecoilState(userLocationState);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSideNav = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleView = () => {
    const nextView = navState === "map" ? "grid" : "map";
    setNavState(nextView);
  };

  const createNewSpot = () => {
    setMapState({ id: "addSpot" });
  };

  const toggleStreetViewCursor = () => {
    const nextState =
      mapState?.id === "streetViewCursor" ? null : { id: "streetViewCursor" };
    setMapState(nextState);
  };

  const handleUserLocation = async () => {
    if (userLocation) {
      setUserLocation(null);
    } else {
      setUserLocation(await getUserLatLng());
    }
  };

  return (
    <nav className={styles.navBar}>
      <Link href="/" passHref>
        <h1>SpotMapper</h1>
      </Link>
      <div className={styles.iconWrapper}>
        <button
          className={cx(styles.icon, styles.streetView)}
          onClick={toggleStreetViewCursor}
        >
          <GrStreetView />
        </button>
        <button
          className={styles.icon}
          type="button"
          onClick={handleUserLocation}
        >
          <MdOutlineMyLocation />
        </button>
        {/* <button
          className={cx(styles.icon, styles.large)}
          type="button"
          onClick={() => {}}
        >
          <BiImageAdd />
        </button> */}
        <button className={styles.icon} type="button" onClick={createNewSpot}>
          <RiMapPinAddFill />
        </button>
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

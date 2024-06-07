import React from "react";
import SideBarHeader from "./SideBarHeader";
import MemberProfile from "./MemberProfile";
import NavLinks from "./NavLinks";

const SideBar = () => {
  return (
    <div className="px-4 w-80 min-h-full bg-base-300 py-12 grid grid-rows-[auto,1fr,auto]">
      <SideBarHeader />
      <NavLinks />
      <MemberProfile />
    </div>
  );
};

export default SideBar;

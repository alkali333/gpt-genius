import React from "react";
import { GiBrainstorm } from "react-icons/gi";
import ThemeSelect from "./ThemeSelect";
import Link from "next/link";

const SideBarHeader = () => {
  return (
    <div className="flex items-center mb-4 gap-4 px-6">
      <Link href="/">
        <GiBrainstorm className="w-10 h-10 text-primary" />
      </Link>
      <Link href="/" className="">
        <h1 className="text-2xl uppercase font-extrabold -ml-3">Attenshun</h1>
      </Link>
      <ThemeSelect />
    </div>
  );
};

export default SideBarHeader;

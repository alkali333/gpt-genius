import React from "react";
import { SiOpenaigym } from "react-icons/si";
import ThemeSelect from "./ThemeSelect";
import Link from "next/link";

const SideBarHeader = () => {
  return (
    <div className="flex items-center mb-4 gap-4 px-6">
      <Link href="/">
        <SiOpenaigym className="w-10 h-10 text-secondary" />
      </Link>
      <Link href="/" className="mr-auto">
        <h1 className="text-xl font-extrabold mr-auto">GPTGenius</h1>
      </Link>
      <ThemeSelect />
    </div>
  );
};

export default SideBarHeader;

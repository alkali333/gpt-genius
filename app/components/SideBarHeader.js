import React from "react";
import Image from "next/image";
import ThemeSelect from "./ThemeSelect";
import Link from "next/link";

const SideBarHeader = () => {
  return (
    <div className="flex items-center mb-4 gap-4 px-6">
      <Link href="/" className="flex-shrink-0">
        <Image
          src="/logo.png"
          alt="Yoga Palace Logo"
          width={75}
          height={75}
          className="object-contain"
        />
      </Link>

      <ThemeSelect />
    </div>
  );
};

export default SideBarHeader;

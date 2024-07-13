"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function MenuCloseWrapper({ children }) {
  const pathname = usePathname();

  useEffect(() => {
    // Function to close the menu
    const closeMenu = () => {
      const drawer = document.getElementById("my-drawer-2");
      if (drawer) {
        drawer.click();
      }
    };
    closeMenu();
  }, [pathname]);

  return <>{children}</>;
}

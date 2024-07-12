// components/layout.js
import { pages } from "../../../utils/pages";
import Link from "next/link";

const Layout = ({ children }) => {
  return (
    <>
      <ul className="menu menu-horizontal bg-base-200 mb-5 rounded-xl">
        {pages.map((page) => (
          <li key={page}>
            <Link className="capitalize text-sm" href={`/about-me/${page}`}>
              {page.replace(/-/g, " ")}
            </Link>
          </li>
        ))}
      </ul>
      {children}
    </>
  );
};

export default Layout;

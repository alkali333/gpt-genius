import Link from "next/link";
import { pages } from "/app/utils/pages";

function AboutMeTopNav() {
  return (
    <ul className="menu menu-vertical lg:menu-horizontal bg-base-200 rounded-xl my-4">
      {pages.map((page) => (
        <li key={page} className="">
          <Link className="uppercase text-sm" href={`/about-me/${page}`}>
            {page.replace(/-/g, " ")}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default AboutMeTopNav;

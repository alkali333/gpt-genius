"use client";

// change to use client and render links on list?
// <a on:click={() => {document.getElementById('my-drawer-2').click()}} href='/test'>Test</a>
import Link from "next/link";

const links = [
  { href: "/chat", label: "chat" },
  { href: "/about-me", label: "Journalling" },
  { href: "/about-me/hopes-and-dreams", label: "My life" },
  { href: "/meditate", label: "meditate" },
  { href: "/profile", label: "profile" },
];

const NavLinks = () => {
  return (
    <ul className="menu text-base-content text-lg">
      {links.map((link, index) => {
        return (
          <li key={index}>
            <Link
              href={link.href}
              className="uppercase"
              onClick={() => {
                document.getElementById("my-drawer-2").click();
              }}
            >
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default NavLinks;

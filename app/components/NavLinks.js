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
            <Link href={link.href} className="uppercase">
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default NavLinks;

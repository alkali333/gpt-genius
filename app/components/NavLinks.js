import Link from "next/link";

const links = [
  { href: "/welcome", label: "Welcome" },
  { href: "/morning-practice", label: "morning practice" },
  { href: "/evening-practice", label: "evening practice" },
  { href: "/my-info/hopes-and-dreams", label: "my info" },
  { href: "/about-me", label: "Journalling" },
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
              className="uppercase rounded-xl transition-all hover:shadow-lg"
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

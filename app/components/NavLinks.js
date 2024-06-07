import Link from "next/link";

const links = [
  { href: "/chat", label: "chat" },
  { href: "/tours", label: "tours" },
  { href: "/tours/new-tour", label: "new tour" },
  { href: "/profile", label: "profile" },
];

const NavLinks = () => {
  return (
    <ul className="menu text-base-content text-lg">
      {links.map((link, index) => {
        return (
          <li key={index}>
            <Link href={link.href} className="capitalize">
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default NavLinks;

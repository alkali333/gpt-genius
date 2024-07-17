import Link from "next/link";

const links = [
  { href: "/chat", label: "chat" },
  { href: "/about-me", label: "Journalling" },
  { href: "/my-info/hopes-and-dreams", label: "my info" },
  { href: "/meditate", label: "meditate" },
  { href: "/daily-diary", label: "daily diary" },
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

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/blog/", label: "Blog" },
  //{ href: "/papers/", label: "Papers" },
];

export default function NavLinks() {
  const pathname = usePathname() ?? "/";
  return (
    <nav className="nav" aria-label="Main">
      {links.map(({ href, label }) => {
        const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link key={href} href={href} aria-current={active ? "page" : undefined}>
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

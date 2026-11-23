import Link from "next/link";
import Cat from "./Cat";
import NavLinks from "./NavLinks";

export default function Header() {
  return (
    <header className="header">
      <Link href="/" className="header__brand">
        <Cat index={0} className="header__cat" />
        <span className="header__name">Ollie Moreland</span>
      </Link>
      <NavLinks />
    </header>
  );
}

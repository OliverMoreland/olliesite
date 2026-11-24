import Link from "next/link";
import Cat from "./Cat";
import NavLinks from "./NavLinks";

//<Cat index={3} className="header__cat" baseRem={0.72} maxRows={11} maxCols={60} /> 
export default function Header() {
  return (
    <header className="header">
      <Link href="/" className="header__brand">
        <span className="header__name">Ollie Moreland</span>
      </Link>
      <NavLinks />
    </header>
  );
}

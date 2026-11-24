import Cat from "./Cat";

export default function Footer() {
  return (
    <footer className="footer">
      <Cat index={2} maxRows={12} />
      <div>
        &copy; {new Date().getFullYear()} Ollie Moreland &middot; built with Next.js, clouds, and cats
      </div>
    </footer>
  );
}

import Link from "next/link";
import Cat from "@/components/Cat";

export default function NotFound() {
  return (
    <>
      <div className="cat-row">
        <Cat index={2} size="large" />
      </div>
      <h1>404: no page here</h1>
      <p>The cat looked, but there is nothing at this address.</p>
      <p>
        <Link href="/">Back home</Link>
      </p>
    </>
  );
}

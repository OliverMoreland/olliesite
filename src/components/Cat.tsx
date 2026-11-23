import { catAt, pickCat } from "@/lib/cats";

type Props = {
  /** Pick a specific cat by index. */
  index?: number;
  /** Or pick one deterministically from a seed string (e.g. a post slug). */
  seed?: string;
  size?: "normal" | "large";
  inline?: boolean;
  className?: string;
};

export default function Cat({ index, seed, size = "normal", inline, className }: Props) {
  const art = index !== undefined ? catAt(index) : pickCat(seed ?? "default");

  const classes = [
    "ascii-cat",
    size === "large" ? "ascii-cat--large" : "",
    inline ? "ascii-cat--inline" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <pre className={classes} role="img" aria-label="ASCII art cat">
      {art}
    </pre>
  );
}

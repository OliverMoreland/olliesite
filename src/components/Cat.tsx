import type { CSSProperties } from "react";
import { catAt, pickCat } from "@/lib/cats";

type Props = {
  /** Pick a specific cat by index (0-based, file order; wraps past the end). */
  index?: number;
  /** Or pick one deterministically from a seed string (e.g. a post slug). */
  seed?: string;
  size?: "normal" | "large";
  inline?: boolean;
  className?: string;
  /**
   * Shrink the font so the cat is at most this many rows tall / cols wide,
   * measured in the cat's own characters. A 30-row cat with maxRows={10}
   * renders at a third of its normal size. Small cats are left alone.
   */
  maxRows?: number;
  maxCols?: number;
  /** Font size (rem) the cat would have without shrinking. Defaults by `size`. */
  baseRem?: number;
};

const BASE_REM = { normal: 0.8, large: 0.95 } as const;
const MIN_REM = 0.16; // ~2.5px: below this even a silhouette stops reading

export default function Cat({
  index,
  seed,
  size = "normal",
  inline,
  className,
  maxRows,
  maxCols,
  baseRem,
}: Props) {
  const art = index !== undefined ? catAt(index) : pickCat(seed ?? "default");
  const lines = art.split("\n");
  const rows = lines.length;
  const cols = Math.max(...lines.map((l) => l.length));

  const base = baseRem ?? BASE_REM[size];
  let rem = base;
  if (maxRows && rows > maxRows) rem = Math.min(rem, (base * maxRows) / rows);
  if (maxCols && cols > maxCols) rem = Math.min(rem, (base * maxCols) / cols);
  rem = Math.max(rem, MIN_REM);

  const style: CSSProperties | undefined =
    rem !== base ? { fontSize: `${rem.toFixed(3)}rem` } : undefined;

  const classes = [
    "ascii-cat",
    size === "large" ? "ascii-cat--large" : "",
    inline ? "ascii-cat--inline" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <pre className={classes} style={style} role="img" aria-label="ASCII art cat">
      {art}
    </pre>
  );
}

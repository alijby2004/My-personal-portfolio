// Minimal className joiner — avoids adding the `clsx` package as a
// dependency for what is a one-line utility.
export function clsx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

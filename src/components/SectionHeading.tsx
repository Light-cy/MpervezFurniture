import { cn } from "@/lib/utils";

/**
 * Section heading with the eyebrow and gold ornament.
 *
 * Pages use `as="h1"` for their top-level heading and keep the default `h2` for
 * headings inside a page, so every route ships exactly one `<h1>`.
 */
export function SectionHeading({
  eyebrow,
  title,
  as: Heading = "h2",
  className,
}: {
  eyebrow: string;
  title: string;
  as?: "h1" | "h2";
  className?: string;
}) {
  return (
    <div className={cn("text-center", className)}>
      <p className="text-xs font-semibold tracking-[0.3em] text-gold uppercase">{eyebrow}</p>
      <Heading
        className={cn(
          "font-display mt-2 font-bold",
          Heading === "h1" ? "text-4xl sm:text-5xl" : "text-3xl sm:text-4xl",
        )}
      >
        {title}
      </Heading>
      <div className="pf-hairline mx-auto mt-4 h-[2px] w-24" />
    </div>
  );
}

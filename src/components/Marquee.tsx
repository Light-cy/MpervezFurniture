const ITEMS = [
  "FACTORY RATES FURNITURE",
  "FURNITURE CUSTOMIZATION AVAILABLE",
  "5 YEAR WARRANTY",
  "PREMIUM QUALITY",
];

function Track() {
  return (
    <div className="flex shrink-0 items-center">
      {ITEMS.map((t) => (
        <span
          key={t}
          className="flex items-center gap-6 pr-6 text-xs font-semibold tracking-[0.2em] whitespace-nowrap text-cream sm:text-sm"
        >
          {t}
          <span className="text-gold" aria-hidden="true">
            ✦
          </span>
        </span>
      ))}
    </div>
  );
}

/** Auto-scrolling red marquee strip. */
export function Marquee() {
  return (
    <div className="overflow-hidden bg-royal py-2.5" aria-hidden="true">
      <div
        className="pf-marquee-track flex w-max"
        style={{ ["--marquee-duration" as string]: "24s" }}
        suppressHydrationWarning
      >
        <Track />
        <Track />
      </div>
    </div>
  );
}

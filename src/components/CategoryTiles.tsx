import { Link } from "@tanstack/react-router";
import {
  Armchair,
  Bed,
  BedDouble,
  Coffee,
  DoorClosed,
  Lamp,
  Layers,
  Sofa,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react";
import { CATEGORIES, type Category } from "@/data/products";

const ICONS: Record<Category, typeof Sofa> = {
  "bedroom-sets": BedDouble,
  beds: Bed,
  "dressing-tables": Sparkles,
  "side-tables": Lamp,
  sofas: Sofa,
  dining: UtensilsCrossed,
  "center-tables": Coffee,
  "sofa-cum-beds": Layers,
  "almirah-showcase": DoorClosed,
  chairs: Armchair,
};

export function CategoryTiles({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3 sm:gap-4">
        {CATEGORIES.map((c) => {
          const Icon = ICONS[c.id] ?? Sofa;
          return (
            <Link
              key={c.id}
              to="/products"
              search={{ category: c.id }}
              className="group flex flex-col items-center gap-2.5 rounded-2xl border border-border bg-night-card p-4 transition-all duration-300 hover:-translate-y-1 hover:border-gold/60 hover:bg-night-elevated sm:p-6"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-night border border-border/80 transition-colors group-hover:border-gold/40 group-hover:bg-gold/10 sm:h-14 sm:w-14">
                <Icon className="h-6 w-6 text-gold transition-transform duration-300 group-hover:scale-110 sm:h-7 sm:w-7" />
              </div>
              <span className="text-center font-display text-sm font-medium text-cream transition-colors group-hover:text-gold sm:text-base">
                {c.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

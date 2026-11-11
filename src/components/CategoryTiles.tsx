import { Link } from "@tanstack/react-router";
import catAlmirahShowcase from "@/assets/categories/almirah-showcase.jpg";
import catBedroomSets from "@/assets/categories/bedroom-sets.jpg";
import catBeds from "@/assets/categories/beds.jpg";
import catCenterTables from "@/assets/categories/center-tables.jpg";
import catChairs from "@/assets/categories/chairs.jpg";
import catDining from "@/assets/categories/dining.jpg";
import catDressingTables from "@/assets/categories/dressing-tables.jpg";
import catSideTables from "@/assets/categories/side-tables.jpg";
import catSofaCumBeds from "@/assets/categories/sofa-cum-beds.jpg";
import catSofas from "@/assets/categories/sofas.jpg";
import { CATEGORIES, type Category } from "@/data/products";

const CATEGORY_IMAGES: Record<Category, string> = {
  beds: catBeds,
  "bedroom-sets": catBedroomSets,
  sofas: catSofas,
  dining: catDining,
  chairs: catChairs,
  "dressing-tables": catDressingTables,
  "center-tables": catCenterTables,
  "side-tables": catSideTables,
  "sofa-cum-beds": catSofaCumBeds,
  "almirah-showcase": catAlmirahShowcase,
};

export function CategoryTiles({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
        {CATEGORIES.map((c) => {
          const image = CATEGORY_IMAGES[c.id];
          return (
            <Link
              key={c.id}
              to="/products"
              search={{ category: c.id }}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-night-card shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-gold/60 hover:shadow-xl hover:shadow-black/40"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-night sm:aspect-square">
                <img
                  src={image}
                  alt={c.label}
                  loading="lazy"
                  width={600}
                  height={600}
                  className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-110"
                />

                {/* Dark luxury gradient overlay: Visible on mobile, revealed on hover on desktop */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/10 transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100" />

                {/* Category label: Always visible on mobile, smooth hover reveal on desktop */}
                <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-end p-3.5 text-center transition-all duration-300 sm:p-5 md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
                  <span className="font-display text-base font-bold tracking-wide text-white drop-shadow-lg transition-transform duration-300 group-hover:scale-105 sm:text-lg md:text-xl">
                    {c.label}
                  </span>
                  <span className="mt-1 hidden items-center gap-1.5 text-xs font-semibold tracking-wide text-white/95 drop-shadow transition-all duration-200 group-hover:text-white md:inline-flex">
                    See Collection →
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function Stars({ rating, className }: { rating: number; className?: string }) {
  return (
    <span
      role="img"
      aria-label={`Rated ${rating} out of 5`}
      className={cn("flex items-center gap-0.5", className)}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          aria-hidden="true"
          className={cn("h-4 w-4", i <= rating ? "fill-gold text-gold" : "text-cream-muted/40")}
        />
      ))}
    </span>
  );
}

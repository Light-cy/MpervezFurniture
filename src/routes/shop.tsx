import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * The catalogue used to live at both `/shop` and `/products`. `/products` is
 * now the only catalogue page, and this route keeps old links, bookmarks and
 * QR codes working by forwarding them — including any `?category=` filter.
 */
export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>): { category?: string } => {
    const c = search["category"];
    return typeof c === "string" && c ? { category: c } : {};
  },
  beforeLoad: ({ search }) => {
    throw redirect({ to: "/products", search });
  },
});

# Project guide

This repository contains the Pervez Furniture website: a mobile-first showcase
for a luxury furniture showroom in Lahore, Pakistan. Customers browse the
catalogue and place orders over WhatsApp. There is no cart, checkout, payment
flow, or customer account system — do not add one.

## Commands

| Command                | Purpose                           |
| ---------------------- | --------------------------------- |
| `npm run dev`          | Start the dev server on port 3000 |
| `npm run build`        | Production build                  |
| `npm run preview`      | Build + serve the app locally     |
| `npm run lint`         | ESLint                            |
| `npm run typecheck`    | TypeScript type check             |
| `npm run format`       | Prettier write                    |
| `npm run format:check` | Prettier check                    |
| `npm test`             | Vitest (single run)               |
| `npm run test:watch`   | Vitest watch mode                 |

## Stack

- React 19 + TypeScript
- TanStack Start (file-based routing, SSR)
- Tailwind CSS v4
- Lucide icons
- Framer Motion
- Vitest + Testing Library
- Nitro for the server build (Cloudflare preset)

## Structure

```
public/          favicon, app icons, manifest, robots.txt, sitemap.xml, OG image
src/
  assets/        product photography, logo, review videos
  components/    shared UI (Navbar, Footer, ProductCard, carousels, …)
  config/        site.ts — business details, site URL and the WhatsApp helper
  data/          products.ts and reviews.ts (the catalogue content)
  lib/           utilities, structured data and error reporting
  routes/        TanStack Start file-based routes
  styles.css     design tokens and shared component styles
```

## Content conventions

- All business details (site URL, phone number, address, hours, social links)
  belong in `src/config/site.ts`. Never hardcode them in components.
- `/products` is the only catalogue page. `/shop` is a redirect to it, and the
  category filter is a `?category=` search param.
- All product data belongs in `src/data/products.ts`. Prices are whole rupees.
- All review data belongs in `src/data/reviews.ts`. Do not add payment,
  checkout, cart, or installment content anywhere — `npm test` enforces this.
- The current catalogue, site URL, phone number, social links and reviews are
  sample content. Replace them with the client's real details before launch,
  including the URL duplicated in `public/robots.txt` and `public/sitemap.xml`.

## Code conventions

- Use the `@/` alias for imports from `src/`.
- Keep components typed and small; follow the existing naming and formatting.
- Brand colours come from CSS tokens in `src/styles.css`. Do not hardcode
  hex values in components.
- Run `npm run lint`, `npm test` and `npm run build` before considering a change
  complete.

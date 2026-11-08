# Pervez Furniture

A mobile-first showroom website for **Pervez Furniture**, a luxury furniture
store in Lahore, Pakistan. Customers browse sofas, beds, dining sets and chairs,
then place orders directly on WhatsApp.

There is no cart, checkout, online payment, or customer account system by
design — every order goes through WhatsApp.

## Highlights

- Dark, gold-accented brand design built mobile-first
- Home page with hero, featured carousel, categories, best sellers and reviews
- Filterable product catalogue at `/products`
- Product pages with image gallery, specifications and WhatsApp ordering
- Coverflow-style review carousel with photo and video media
- Sticky navbar, mobile tab bar and floating WhatsApp button
- Server-rendered metadata: canonical URLs, Open Graph, JSON-LD, sitemap and web
  manifest

## Tech stack

- [React 19](https://react.dev) + TypeScript
- [TanStack Start](https://tanstack.com/start) (file-based routing, SSR)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Framer Motion](https://motion.dev)
- [Vitest](https://vitest.dev) + Testing Library
- [Nitro](https://nitro.build) for the server build (Cloudflare preset)

## Getting started

Requires **Node.js 22.12 or newer** (see `.nvmrc`).

```sh
npm ci
npm run dev
```

The dev server runs at `http://localhost:3000`.

## Scripts

| Command                | Description                                         |
| ---------------------- | --------------------------------------------------- |
| `npm run dev`          | Start the development server on port 3000           |
| `npm run build`        | Production build for deployment (Cloudflare preset) |
| `npm run preview`      | Build with the Node preset and serve it locally     |
| `npm run lint`         | Run ESLint                                          |
| `npm run typecheck`    | Run the TypeScript compiler                         |
| `npm run format`       | Format the project with Prettier                    |
| `npm run format:check` | Check formatting without writing                    |
| `npm test`             | Run the test suite once                             |
| `npm run test:watch`   | Run tests in watch mode                             |

## Project structure

```text
public/           favicon, app icons, manifest, robots.txt, sitemap.xml, OG image
src/
  assets/         logo, product photography, review videos
  components/     shared UI components
  config/         site.ts — business details, URLs and WhatsApp helper
  data/           products.ts, reviews.ts
  lib/            utilities, structured data and error reporting
  routes/         TanStack Start file-based routes
  styles.css      design tokens and shared styles
```

## Routes

| Route          | Purpose                                         |
| -------------- | ----------------------------------------------- |
| `/`            | Home page                                       |
| `/products`    | Full catalogue, filterable with `?category=`    |
| `/product/$id` | Product detail page                             |
| `/reviews`     | All customer reviews                            |
| `/contact`     | Showroom details and WhatsApp ordering          |
| `/shop`        | Redirects to `/products`, preserving the filter |

## Configuration

Business details are centralised in [`src/config/site.ts`](src/config/site.ts):

- Public site URL (used for canonical links, Open Graph and the sitemap)
- WhatsApp number (international format, digits only)
- Display phone number
- Showroom address and opening hours
- Social media links

Catalogue content lives in [`src/data/products.ts`](src/data/products.ts) and
[`src/data/reviews.ts`](src/data/reviews.ts).

> **Before launch:** the site URL, WhatsApp number, address, social links,
> product catalogue and reviews currently contain sample content. Replace them
> with the client's verified details and photography. `public/sitemap.xml` and
> `public/robots.txt` repeat the site URL and must be updated with it.

## Deployment

`npm run build` produces a Nitro server bundle in `.output/` using the Cloudflare
preset. Change the preset in `vite.config.ts` if the site is deployed somewhere
else. `npm run preview` builds with the Node preset instead, so the production
output can be checked locally without Wrangler.

## License

MIT — see [LICENSE](LICENSE).

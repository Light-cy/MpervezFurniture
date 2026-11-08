import { SITE, absoluteUrl } from "@/config/site";
import type { Product } from "@/data/products";

/** JSON-LD for the showroom itself, rendered once in the root document head. */
export function storeSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FurnitureStore",
    name: SITE.name,
    url: SITE.url,
    logo: absoluteUrl("/icon-512.png"),
    image: absoluteUrl("/og-image.jpg"),
    description:
      "Luxury hand-crafted bedroom sets, beds, sofas, and dining sets at factory rates in Lahore, Pakistan. Browse the catalogue and order on WhatsApp.",
    telephone: `+${SITE.whatsappNumber}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address,
      addressLocality: SITE.addressCity,
      addressCountry: SITE.addressCountry,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "12:00",
      closes: "22:00",
    },
    sameAs: Object.values(SITE.socials),
  };
}

/** JSON-LD for a single product page. Deliberately omits ratings and reviews. */
export function productSchema(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.id,
    image: absoluteUrl(product.images[0] ?? "/og-image.jpg"),
    brand: { "@type": "Brand", name: SITE.name },
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/product/${product.id}`),
      price: product.price,
      priceCurrency: "PKR",
      availability: "https://schema.org/InStock",
      seller: { "@type": "Organization", name: SITE.name },
    },
  };
}

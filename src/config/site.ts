/**
 * Central store configuration.
 *
 * Edit the values below to change the WhatsApp number, address, opening hours
 * and social links — nothing else needs touching.
 */
export const SITE = {
  name: "Pervez Furniture",
  tagline: "Factory Rates Furniture Available · Customization of Furniture Available",
  /** Public origin of the deployed site, no trailing slash. */
  url: "https://pervezfurniture.example",
  /** WhatsApp number in international format, digits only (no +, spaces or dashes). */
  whatsappNumber: "923224679512",
  whatsappDisplay: "+92 322 4679512",
  address: "Margzar Scheme, 80 Feet Road, near Allama Iqbal Town, Karim Block, Lahore",
  /** Used for structured data; keep in step with `address`. */
  addressCity: "Lahore",
  addressCountry: "PK",
  hours: "All days open, 12:00 PM – 10:00 PM",
  socials: {
    facebook: "https://facebook.com/pervezfurniture",
    instagram: "https://instagram.com/pervezfurniture",
    tiktok: "https://tiktok.com/@pervezfurniture",
    youtube: "https://youtube.com/@pervezfurniture",
  },
} as const;

/** Builds a https://wa.me link with an optional pre-filled message. */
export function waLink(message?: string): string {
  const base = `https://wa.me/${SITE.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Resolves a site path such as `/products` to an absolute URL for metadata. */
export function absoluteUrl(path = "/"): string {
  return new URL(path, SITE.url).toString();
}

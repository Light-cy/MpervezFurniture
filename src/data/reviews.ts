import bedShahi from "@/assets/products/bed-shahi.jpg";
import chairWingback from "@/assets/products/chair-wingback.jpg";
import diningMarble from "@/assets/products/dining-marble.jpg";
import sofaChester from "@/assets/products/sofa-chester.jpg";
import reviewBedVideo from "@/assets/reviews/review-bed.mp4";
import reviewSofaVideo from "@/assets/reviews/review-sofa.mp4";

export type ReviewMedia = { type: "image"; url: string } | { type: "video"; url: string };

export interface Review {
  name: string;
  area: string;
  rating: number;
  text: string;
  /** Optional: ties a review to one product. */
  productId?: string;
  media: ReviewMedia[];
}

/**
 * Sample customer reviews used while the site is in development.
 * Replace these with verified customer reviews before launch.
 */
export const REVIEWS: Review[] = [
  {
    name: "Ahmed Raza",
    area: "DHA Phase 6, Lahore",
    rating: 5,
    text: "The Shahi sofa set transformed our lounge completely. Carving work is pure art — guests ask where it is from every single time. Delivery team was very professional.",
    productId: "shahi-royal-sofa-7",
    media: [{ type: "video", url: reviewSofaVideo }],
  },
  {
    name: "Fatima Khan",
    area: "Gulberg, Lahore",
    rating: 5,
    text: "We ordered the king bed for our new home and it arrived exactly as shown. The velvet headboard and carved gold work look even better in person. Highly recommended!",
    productId: "shahi-carved-king-bed",
    media: [
      { type: "image", url: bedShahi },
      { type: "video", url: reviewBedVideo },
    ],
  },
  {
    name: "Bilal Hussain",
    area: "Bahria Town, Lahore",
    rating: 5,
    text: "Bought the chesterfield sofa last month. Sitting comfort is excellent and the stitching quality is far better than what we saw in other showrooms.",
    productId: "grand-chesterfield-sofa",
    media: [{ type: "image", url: sofaChester }],
  },
  {
    name: "Ayesha Malik",
    area: "DHA Phase 5, Lahore",
    rating: 4,
    text: "The marble dining set is the centrepiece of our house now. Took a couple of days longer than promised, but the finish was worth the wait.",
    productId: "royal-marble-dining-8",
    media: [{ type: "image", url: diningMarble }],
  },
  {
    name: "Usman Tariq",
    area: "Model Town, Lahore",
    rating: 5,
    text: "Ordered two accent chairs for our office reception. Everyone who visits asks about them. Ordering on WhatsApp was quick and simple.",
    productId: "maharaja-accent-chair",
    media: [],
  },
  {
    name: "Sana Ahmed",
    area: "Johar Town, Lahore",
    rating: 5,
    text: "The wingback chair is my reading corner now. Beautiful fabric, solid wood — you can feel the quality the moment you sit down.",
    productId: "baroque-wingback-chair",
    media: [{ type: "image", url: chairWingback }],
  },
];

/** Reviews shown for a product page: its own reviews first, then store-wide ones. */
export function reviewsForProduct(productId: string): Review[] {
  const own = REVIEWS.filter((r) => r.productId === productId);
  const rest = REVIEWS.filter((r) => r.productId !== productId);
  return [...own, ...rest];
}

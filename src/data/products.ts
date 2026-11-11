import bedRosewood from "@/assets/products/bed-rosewood.jpg";
import bedShahi from "@/assets/products/bed-shahi.jpg";
import centerTable from "@/assets/products/center-table.jpg";
import chairAccent from "@/assets/products/chair-accent.jpg";
import chairWingback from "@/assets/products/chair-wingback.jpg";
import diningMarble from "@/assets/products/dining-marble.jpg";
import diningRound from "@/assets/products/dining-round.jpg";
import dressingTable from "@/assets/products/dressing-table.jpg";
import sideTable from "@/assets/products/side-table.jpg";
import sofaBed from "@/assets/products/sofa-bed.jpg";
import sofaChester from "@/assets/products/sofa-chester.jpg";
import sofaRoyal from "@/assets/products/sofa-royal.jpg";
import wardrobe from "@/assets/products/wardrobe.jpg";

export type Category =
  | "bedroom-sets"
  | "beds"
  | "dressing-tables"
  | "side-tables"
  | "sofas"
  | "dining"
  | "center-tables"
  | "sofa-cum-beds"
  | "almirah-showcase"
  | "chairs";

export interface ProductColour {
  name: string;
  hex: string;
  image: string;
  filter?: string;
}

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  originalPrice?: number | undefined;
  badge?: "NEW" | "SALE" | "HOT";
  images: string[];
  colours: ProductColour[];
  specs: Record<string, string>;
  description: string;
  bestSeller: boolean;
}

export const DEFAULT_COLOUR_SWATCHES = [
  { name: "Brown", hex: "#5C3A21" },
  { name: "Black", hex: "#1C1C1C" },
  { name: "Grey", hex: "#7A7D82" },
  { name: "Off-White", hex: "#F5F2EB" },
] as const;

export function buildDefaultColours(
  primaryImage: string,
  secondaryImage?: string,
): ProductColour[] {
  const altImage = secondaryImage || primaryImage;
  return [
    { name: "Brown", hex: "#5C3A21", image: primaryImage },
    {
      name: "Black",
      hex: "#1C1C1C",
      image: altImage,
      filter: "grayscale(0.85) brightness(0.75) contrast(1.15)",
    },
    {
      name: "Grey",
      hex: "#7A7D82",
      image: primaryImage,
      filter: "grayscale(0.9) brightness(0.95)",
    },
    {
      name: "Off-White",
      hex: "#F5F2EB",
      image: altImage,
      filter: "sepia(0.25) brightness(1.12)",
    },
  ];
}

export const CATEGORIES: { id: Category; label: string }[] = [
  { id: "beds", label: "Beds" },
  { id: "bedroom-sets", label: "Bedroom Sets" },
  { id: "sofas", label: "Sofa Sets" },
  { id: "dining", label: "Dining" },
  { id: "chairs", label: "Chairs" },
  { id: "dressing-tables", label: "Dressing Tables" },
  { id: "center-tables", label: "Center Tables" },
  { id: "side-tables", label: "Side Tables" },
  { id: "sofa-cum-beds", label: "Sofa Cum Beds" },
  { id: "almirah-showcase", label: "Almirah & Showcase" },
];

export const PRODUCTS: Product[] = [
  {
    id: "shahi-carved-bedroom-set",
    name: "Modern Luxury Bridal Bedroom Set — Complete 6-Piece",
    category: "bedroom-sets",
    price: 345000,
    badge: "HOT",
    images: [bedShahi, bedRosewood],
    colours: buildDefaultColours(bedShahi, bedRosewood),
    description:
      "A complete modern bridal suite including king size upholstered bed, two contemporary nightstands, luxury vanity dresser with framed mirror, and bench. Customization available.",
    bestSeller: true,
    specs: {
      Set: "King Bed + 2 Nightstands + Dresser + Mirror Frame + Bench",
      Material: "Seasoned solid wood frame with premium textured upholstery",
      Finish: "Warm luxury finish with ambient design accents",
      Warranty: "5 years",
      Delivery: "Available across Lahore & Pakistan (Charges as per distance)",
    },
  },
  {
    id: "shahi-carved-king-bed",
    name: "Milano Luxury Upholstered King Bed",
    category: "beds",
    price: 165000,
    badge: "HOT",
    images: [bedRosewood, bedShahi],
    colours: buildDefaultColours(bedRosewood, bedShahi),
    description:
      "A contemporary king size bed crowned with plush channeled headboard and tailored luxury fabric. Direct factory pricing with 5 year warranty.",
    bestSeller: true,
    specs: {
      Dimensions: "King Size (6ft x 6.5ft)",
      Material: "Solid hardwood frame, premium velvet/linen headboard",
      Frame: "Kiln-dried seasoned internal wood structure",
      Foam: "High-density cushioned headboard",
      Warranty: "5 years",
      Delivery: "Available across Lahore & Pakistan (Charges as per distance)",
    },
  },
  {
    id: "noor-mahal-rosewood-bed",
    name: "Nordic Minimalist Queen Bed",
    category: "beds",
    price: 142000,
    badge: "SALE",
    images: [bedRosewood, bedShahi],
    colours: buildDefaultColours(bedRosewood, bedShahi),
    description:
      "Warm neutral upholstered headboard with sleek modern lines and low-profile frame — peaceful, understated elegance.",
    bestSeller: true,
    specs: {
      Dimensions: "Queen Size (5ft x 6.5ft)",
      Material: "Solid wood frame with warm neutral upholstery",
      Frame: "Modern low-profile platform frame",
      Foam: "High-density padded headboard",
      Warranty: "5 years",
      Delivery: "Available across Lahore & Pakistan (Charges as per distance)",
    },
  },
  {
    id: "royal-carved-dressing-table",
    name: "Contemporary Vanity Dressing Table",
    category: "dressing-tables",
    price: 78000,
    badge: "NEW",
    images: [dressingTable, sideTable],
    colours: buildDefaultColours(dressingTable, sideTable),
    description:
      "Spacious modern vanity dresser featuring high-clarity bevelled mirror, smooth sliding drawers, and clean architectural lines.",
    bestSeller: true,
    specs: {
      Mirror: "High-clarity crystal mirror in minimalist frame",
      Storage: "Smooth soft-close sliding drawers",
      Material: "Moisture-resistant seasoned wood & engineered core",
      Warranty: "5 years",
      Delivery: "Available across Lahore & Pakistan (Charges as per distance)",
    },
  },
  {
    id: "mughal-luxury-side-tables",
    name: "Modern Luxury Bedside Nightstands (Pair)",
    category: "side-tables",
    price: 42000,
    badge: "NEW",
    images: [sideTable, dressingTable],
    colours: buildDefaultColours(sideTable, dressingTable),
    description:
      "Pair of two contemporary luxury bedside tables with smooth dual drawers. Built to match modern bed collections.",
    bestSeller: false,
    specs: {
      Quantity: "Set of 2 Bedside Tables",
      Storage: "2 Drawers per table with sleek hardware",
      Material: "Solid hardwood & moisture-resistant core",
      Warranty: "5 years",
      Delivery: "Available across Lahore & Pakistan (Charges as per distance)",
    },
  },
  {
    id: "shahi-royal-sofa-7",
    name: "Modern Luxury Curved Velvet Sofa Set — 7 Seater",
    category: "sofas",
    price: 185000,
    badge: "HOT",
    images: [sofaRoyal, sofaChester],
    colours: buildDefaultColours(sofaRoyal, sofaChester),
    description:
      "Curved designer sofa set wrapped in plush luxury emerald velvet — a complete modern drawing-room statement at direct factory rates.",
    bestSeller: true,
    specs: {
      Seats: "7 Seater (3+2+1+1)",
      Material: "Imported plush velvet with concealed solid wood frame",
      Frame: "Seasoned internal hardwood structure",
      Foam: "High-resilience 32-density Master Molty foam",
      Warranty: "5 years",
      Delivery: "Available across Lahore & Pakistan (Charges as per distance)",
    },
  },
  {
    id: "grand-chesterfield-sofa",
    name: "Modern Low-Profile Designer Sofa",
    category: "sofas",
    price: 95000,
    badge: "NEW",
    images: [sofaChester, sofaRoyal],
    colours: buildDefaultColours(sofaChester, sofaRoyal),
    description:
      "Tailored modern profile in plush velvet with clean lines and deep relaxation cushioning — timeless luxury for modern homes.",
    bestSeller: true,
    specs: {
      Seats: "3 Seater",
      Material: "Premium textured velvet upholstery",
      Frame: "Kiln-dried hardwood internal frame",
      Foam: "High-density moulded ergonomic foam",
      Warranty: "5 years",
      Delivery: "Available across Lahore & Pakistan (Charges as per distance)",
    },
  },
  {
    id: "royal-marble-dining-8",
    name: "Modern Italian Marble Dining Set — 8 Seater",
    category: "dining",
    price: 210000,
    badge: "HOT",
    images: [diningMarble, diningRound],
    colours: buildDefaultColours(diningMarble, diningRound),
    description:
      "Italian composite marble top on an architectural modern pedestal base, paired with 8 contemporary upholstered dining chairs.",
    bestSeller: true,
    specs: {
      Seats: "8 Seater (Table + 8 Dining Chairs)",
      Material: "Polished composite marble with plush chairs",
      Frame: "Sculpted hardwood pedestal base with protective coat",
      Foam: "High-resilience ergonomic seat foam",
      Warranty: "5 years",
      Delivery: "Available across Lahore & Pakistan (Charges as per distance)",
    },
  },
  {
    id: "zar-gold-round-dining-4",
    name: "Minimalist Round Dining Set — 4 Seater",
    category: "dining",
    price: 118000,
    badge: "NEW",
    images: [diningRound, diningMarble],
    colours: buildDefaultColours(diningRound, diningMarble),
    description:
      "Round designer dining table with minimalist pedestal and 4 sculpted dining chairs — compact elegance at factory price.",
    bestSeller: true,
    specs: {
      Seats: "4 Seater Round Table + 4 Chairs",
      Material: "Composite marble/hardwood top with upholstered chairs",
      Frame: "Sculpted central pedestal base",
      Foam: "High-resilience seat foam",
      Warranty: "5 years",
      Delivery: "Available across Lahore & Pakistan (Charges as per distance)",
    },
  },
  {
    id: "shahi-sheesham-center-table",
    name: "Modern Fluted Center Coffee Table Set",
    category: "center-tables",
    price: 54000,
    badge: "NEW",
    images: [centerTable, sideTable],
    colours: buildDefaultColours(centerTable, sideTable),
    description:
      "Sculptural round fluted coffee table with matching nested accent side tables. Modern aesthetic for luxury lounges.",
    bestSeller: false,
    specs: {
      Set: "1 Main Center Table + 2 Nested Side Tables",
      Top: "Matte stone-composite / polished wood finish",
      Frame: "Solid seasoned hardwood core",
      Warranty: "5 years",
      Delivery: "Available across Lahore & Pakistan (Charges as per distance)",
    },
  },
  {
    id: "luxury-convertible-sofa-cum-bed",
    name: "Modern Convertible Luxury Sofa Bed",
    category: "sofa-cum-beds",
    price: 89000,
    badge: "HOT",
    images: [sofaBed, sofaChester],
    colours: buildDefaultColours(sofaBed, sofaChester),
    description:
      "Sleek contemporary convertible sofa with smooth pull-out mechanism, transforming into a comfortable queen bed in seconds.",
    bestSeller: true,
    specs: {
      Mechanism: "Heavy-duty smooth glide pull-out steel frame",
      Foam: "High-density orthopaedic foam mattress",
      Material: "Stain-resistant premium upholstery",
      Warranty: "5 years",
      Delivery: "Available across Lahore & Pakistan (Charges as per distance)",
    },
  },
  {
    id: "grand-mughal-almirah-showcase",
    name: "Modern Minimalist Wardrobe & Showcase",
    category: "almirah-showcase",
    price: 195000,
    badge: "NEW",
    images: [wardrobe, dressingTable],
    colours: buildDefaultColours(wardrobe, dressingTable),
    description:
      "Contemporary 4-door wardrobe featuring tempered glass display showcase, soft-close hardware, interior drawer safe, and deep hanging space.",
    bestSeller: false,
    specs: {
      Dimensions: "7ft Height x 6.5ft Width x 2ft Depth",
      Material: "Seasoned wood structure & high-density moisture-resistant core",
      Hardware: "Heavy-duty soft-close European hinges & handles",
      Warranty: "5 years",
      Delivery: "Available across Lahore & Pakistan (Charges as per distance)",
    },
  },
  {
    id: "maharaja-accent-chair",
    name: "Modern Sculptural Accent Lounge Chair",
    category: "chairs",
    price: 68000,
    badge: "HOT",
    images: [chairAccent, chairWingback],
    colours: buildDefaultColours(chairAccent, chairWingback),
    description:
      "Iconic modern statement chair in rich textured fabric with sculpted curves and deep ergonomic comfort. Direct factory price.",
    bestSeller: true,
    specs: {
      Seats: "1 Seater Accent Lounge Chair",
      Material: "Premium textured upholstery",
      Frame: "Internal solid hardwood frame",
      Foam: "High-density contoured foam",
      Warranty: "5 years",
      Delivery: "Available across Lahore & Pakistan (Charges as per distance)",
    },
  },
  {
    id: "baroque-wingback-chair",
    name: "Contemporary High-Back Velvet Lounge Chair",
    category: "chairs",
    price: 58000,
    badge: "SALE",
    images: [chairWingback, chairAccent],
    colours: buildDefaultColours(chairWingback, chairAccent),
    description:
      "Modern high-back lounge chair in plush velvet with tailored piping and comfortable lumbar support — ideal corner statement.",
    bestSeller: false,
    specs: {
      Seats: "1 Seater High-Back Chair",
      Material: "Plush velvet upholstery with tailored piping",
      Frame: "Solid hardwood internal frame with sleek legs",
      Foam: "High-density contoured seat foam",
      Warranty: "5 years",
      Delivery: "Available across Lahore & Pakistan (Charges as per distance)",
    },
  },
];

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function formatPrice(price: number): string {
  return `Rs. ${price.toLocaleString("en-PK")}`;
}

export function formatOriginalPrice(price: number, originalPrice?: number): string {
  const original = originalPrice ?? Math.round((price * 1.55) / 500) * 500;
  return `Rs. ${original.toLocaleString("en-PK")}`;
}

export function orderMessage(product: Product, chosenColour?: string): string {
  const colourSuffix = chosenColour ? ` in ${chosenColour}` : "";
  return `Assalam-o-Alaikum, I want to order ${product.name}${colourSuffix} - ${formatPrice(product.price)}`;
}

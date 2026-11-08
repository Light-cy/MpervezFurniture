import bedRosewood from "@/assets/products/bed-rosewood.jpg";
import bedShahi from "@/assets/products/bed-shahi.jpg";
import chairAccent from "@/assets/products/chair-accent.jpg";
import chairWingback from "@/assets/products/chair-wingback.jpg";
import diningMarble from "@/assets/products/dining-marble.jpg";
import diningRound from "@/assets/products/dining-round.jpg";
import sofaChester from "@/assets/products/sofa-chester.jpg";
import sofaRoyal from "@/assets/products/sofa-royal.jpg";

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
  { id: "bedroom-sets", label: "Bedroom Sets" },
  { id: "beds", label: "Beds" },
  { id: "dressing-tables", label: "Dressing Tables" },
  { id: "side-tables", label: "Side Tables" },
  { id: "sofas", label: "Sofa Sets" },
  { id: "dining", label: "Dining" },
  { id: "center-tables", label: "Center Tables" },
  { id: "sofa-cum-beds", label: "Sofa Cum Beds" },
  { id: "almirah-showcase", label: "Almirah & Showcase" },
];

export const PRODUCTS: Product[] = [
  {
    id: "shahi-carved-bedroom-set",
    name: "Royal Shahi Bridal Bedroom Set — Complete 6-Piece",
    category: "bedroom-sets",
    price: 345000,
    badge: "HOT",
    images: [bedShahi, bedRosewood],
    colours: buildDefaultColours(bedShahi, bedRosewood),
    description:
      "A complete royal bridal set including king size bed, two carved side tables, luxury dresser with framed mirror, and ottoman. Customization available.",
    bestSeller: true,
    specs: {
      Set: "King Bed + 2 Side Tables + Dresser + Mirror Frame + Ottoman",
      Material: "Pure seasoned sheesham wood with gold-leaf accents",
      Finish: "High-gloss royal antique lacquer",
      Warranty: "5 years",
      Delivery: "Available across Lahore & Pakistan (Charges as per distance)",
    },
  },
  {
    id: "shahi-carved-king-bed",
    name: "Shahi Hand-Carved King Bed",
    category: "beds",
    price: 165000,
    badge: "HOT",
    images: [bedShahi, bedRosewood],
    colours: buildDefaultColours(bedShahi, bedRosewood),
    description:
      "A majestic hand-carved headboard crowned with gold floral detailing and tufted burgundy velvet. Direct factory pricing.",
    bestSeller: true,
    specs: {
      Dimensions: "King Size (6ft x 6.5ft)",
      Material: "Solid sheesham wood, velvet headboard",
      Frame: "Hand-carved sheesham with gold-leaf work",
      Foam: "High-density padded headboard",
      Warranty: "5 years",
      Delivery: "Available across Lahore & Pakistan (Charges as per distance)",
    },
  },
  {
    id: "noor-mahal-rosewood-bed",
    name: "Noor Mahal Rosewood Bed",
    category: "beds",
    price: 142000,
    badge: "SALE",
    images: [bedRosewood, bedShahi],
    colours: buildDefaultColours(bedRosewood, bedShahi),
    description:
      "Cream tufted headboard on hand-carved rosewood with champagne silk bedding — soft, royal elegance.",
    bestSeller: false,
    specs: {
      Dimensions: "Queen Size (5ft x 6.5ft)",
      Material: "Rosewood with cream velvet headboard",
      Frame: "Hand-carved rosewood",
      Foam: "High-density padded headboard",
      Warranty: "5 years",
      Delivery: "Available across Lahore & Pakistan (Charges as per distance)",
    },
  },
  {
    id: "royal-carved-dressing-table",
    name: "Royal Carved Vanity Dressing Table",
    category: "dressing-tables",
    price: 78000,
    badge: "NEW",
    images: [bedShahi, bedRosewood],
    colours: buildDefaultColours(bedShahi, bedRosewood),
    description:
      "Spacious 6-drawer carved vanity dresser featuring high-clarity bevelled mirror frame with ornate Mughal hand-carving.",
    bestSeller: false,
    specs: {
      Mirror: "Bevelled crystal mirror in carved wooden frame",
      Storage: "6 smooth sliding storage drawers",
      Material: "Seasoned sheesham wood",
      Warranty: "5 years",
      Delivery: "Available across Lahore & Pakistan (Charges as per distance)",
    },
  },
  {
    id: "mughal-luxury-side-tables",
    name: "Mughal Carved Bedside Tables (Pair)",
    category: "side-tables",
    price: 42000,
    badge: "NEW",
    images: [bedRosewood, bedShahi],
    colours: buildDefaultColours(bedRosewood, bedShahi),
    description:
      "Pair of two luxury bedside tables with dual drawers and antique brass knobs. Built to match our royal bed sets.",
    bestSeller: false,
    specs: {
      Quantity: "Set of 2 Bedside Tables",
      Storage: "2 Drawers per table with brass handles",
      Material: "Solid hardwood & sheesham",
      Warranty: "5 years",
      Delivery: "Available across Lahore & Pakistan (Charges as per distance)",
    },
  },
  {
    id: "shahi-royal-sofa-7",
    name: "Shahi Royal Velvet Sofa Set — 7 Seater",
    category: "sofas",
    price: 185000,
    badge: "HOT",
    images: [sofaRoyal, chairAccent],
    colours: buildDefaultColours(sofaRoyal, sofaChester),
    description:
      "Hand-carved gold-leaf frame wrapped in royal emerald velvet — a complete drawing-room set for a truly regal look at factory price.",
    bestSeller: true,
    specs: {
      Seats: "7 Seater (3+2+1+1)",
      Material: "Imported velvet with gold-leaf carved accents",
      Frame: "Seasoned sheesham wood",
      Foam: "High-resilience 32-density Master Molty foam",
      Warranty: "5 years",
      Delivery: "Available across Lahore & Pakistan (Charges as per distance)",
    },
  },
  {
    id: "grand-chesterfield-sofa",
    name: "Grand Chesterfield Velvet Sofa",
    category: "sofas",
    price: 95000,
    badge: "NEW",
    images: [sofaChester, sofaRoyal],
    colours: buildDefaultColours(sofaChester, sofaRoyal),
    description:
      "Deep-button tufted chesterfield in plush velvet with slim antique gold legs — timeless luxury for modern homes.",
    bestSeller: true,
    specs: {
      Seats: "3 Seater",
      Material: "Premium velvet upholstery",
      Frame: "Kiln-dried hardwood",
      Foam: "High-density moulded foam",
      Warranty: "5 years",
      Delivery: "Available across Lahore & Pakistan (Charges as per distance)",
    },
  },
  {
    id: "royal-marble-dining-8",
    name: "Royal Marble Dining Set — 8 Seater",
    category: "dining",
    price: 210000,
    badge: "HOT",
    images: [diningMarble, diningRound],
    colours: buildDefaultColours(diningMarble, diningRound),
    description:
      "Italian-look heavy marble top on a sculpted dark wood pedestal with gold accents and 8 tufted velvet dining chairs.",
    bestSeller: true,
    specs: {
      Seats: "8 Seater (6 chairs + 2 master armchairs)",
      Material: "Marble top with plush velvet chairs",
      Frame: "Carved hardwood pedestal with gold trim",
      Foam: "High-resilience seat foam",
      Warranty: "5 years",
      Delivery: "Available across Lahore & Pakistan (Charges as per distance)",
    },
  },
  {
    id: "zar-gold-round-dining-4",
    name: "Zar Gold Round Dining Set — 4 Seater",
    category: "dining",
    price: 118000,
    badge: "NEW",
    images: [diningRound, diningMarble],
    colours: buildDefaultColours(diningRound, diningMarble),
    description:
      "Round marble top on a sculpted gold pedestal with mustard velvet chairs — compact dining elegance at factory price.",
    bestSeller: false,
    specs: {
      Seats: "4 Seater Round Table + 4 Chairs",
      Material: "Marble top with velvet chairs",
      Frame: "Sculpted gold-tone pedestal base",
      Foam: "High-resilience seat foam",
      Warranty: "5 years",
      Delivery: "Available across Lahore & Pakistan (Charges as per distance)",
    },
  },
  {
    id: "shahi-sheesham-center-table",
    name: "Shahi Carved Sheesham Center Table Set",
    category: "center-tables",
    price: 54000,
    badge: "NEW",
    images: [diningRound, diningMarble],
    colours: buildDefaultColours(diningRound, diningMarble),
    description:
      "Hand-carved sheesham center table complete with 2 nesting side tables. Scratch-resistant polish and durable structure.",
    bestSeller: false,
    specs: {
      Set: "1 Main Center Table + 2 Nested Side Tables",
      Top: "Heavy bevelled glass / polished wood top",
      Frame: "Seasoned sheesham wood",
      Warranty: "5 years",
      Delivery: "Available across Lahore & Pakistan (Charges as per distance)",
    },
  },
  {
    id: "luxury-convertible-sofa-cum-bed",
    name: "Royal Tufted Velvet Sofa Cum Bed",
    category: "sofa-cum-beds",
    price: 89000,
    badge: "HOT",
    images: [sofaRoyal, sofaChester],
    colours: buildDefaultColours(sofaRoyal, sofaChester),
    description:
      "Easy hydraulic mechanism transforms this plush velvet luxury sofa into a comfortable queen-size bed in seconds.",
    bestSeller: true,
    specs: {
      Mechanism: "Heavy-duty steel hydraulic pull-out",
      Foam: "High-density orthopaedic foam mattress",
      Material: "Stain-resistant velvet upholstery",
      Warranty: "5 years",
      Delivery: "Available across Lahore & Pakistan (Charges as per distance)",
    },
  },
  {
    id: "grand-mughal-almirah-showcase",
    name: "Grand Mughal 4-Door Wardrobe & Showcase",
    category: "almirah-showcase",
    price: 195000,
    badge: "NEW",
    images: [bedShahi, bedRosewood],
    colours: buildDefaultColours(bedShahi, bedRosewood),
    description:
      "Ornate 4-door wardrobe featuring tempered glass display showcase, interior drawer safe, and deep hanging space.",
    bestSeller: false,
    specs: {
      Dimensions: "7ft Height x 6.5ft Width x 2ft Depth",
      Material: "Seasoned sheesham wood frame & high-density moisture-resistant core",
      Hardware: "Heavy-duty soft-close hinges & brass handles",
      Warranty: "5 years",
      Delivery: "Available across Lahore & Pakistan (Charges as per distance)",
    },
  },
  {
    id: "maharaja-accent-chair",
    name: "Maharaja Royal Accent Chair",
    category: "chairs",
    price: 68000,
    badge: "HOT",
    images: [chairAccent, chairWingback],
    colours: buildDefaultColours(chairAccent, chairWingback),
    description:
      "Tufted royal blue velvet throne chair with a fully hand-carved gold-leaf frame. Direct factory price.",
    bestSeller: true,
    specs: {
      Seats: "1 Seater Accent Chair",
      Material: "Tufted velvet upholstery",
      Frame: "Hand-carved gold-leaf hardwood",
      Foam: "High-density seat foam",
      Warranty: "5 years",
      Delivery: "Available across Lahore & Pakistan (Charges as per distance)",
    },
  },
  {
    id: "baroque-wingback-chair",
    name: "Baroque Wingback Chair",
    category: "chairs",
    price: 58000,
    badge: "SALE",
    images: [chairWingback, chairAccent],
    colours: buildDefaultColours(chairWingback, chairAccent),
    description:
      "Oxblood velvet wingback with ornate gold carved trim and cabriole legs — a statement corner piece.",
    bestSeller: false,
    specs: {
      Seats: "1 Seater Wingback",
      Material: "Velvet upholstery with gold piping",
      Frame: "Carved hardwood with gold-leaf trim",
      Foam: "High-density seat foam",
      Warranty: "5 years",
      Delivery: "Available across Lahore & Pakistan (Charges as per distance)",
    },
  },
];

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function formatPrice(price: number): string {
  return `Rs ${price.toLocaleString("en-PK")}`;
}

export function orderMessage(product: Product, chosenColour?: string): string {
  const colourSuffix = chosenColour ? ` in ${chosenColour}` : "";
  return `Assalam-o-Alaikum, I want to order ${product.name}${colourSuffix} - ${formatPrice(product.price)}`;
}

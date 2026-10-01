import { baseURL } from "@/utils/cn";

export type Status = "active" | "archived" | "draft" | "published" | "review";

export type Category = {
  count: number;
  image: string;
  name: string;
  slug: string;
  status: Extract<Status, "draft" | "published">;
};

export type Brand = {
  count: number;
  image: string;
  name: string;
  slug: string;
  status: Extract<Status, "archived" | "draft" | "published">;
  visibility: "Featured" | "Hidden" | "Standard";
  website: string;
};

export type Attribute = {
  name: string;
  products: number;
  status: Extract<Status, "draft" | "published">;
  type: "Dropdown" | "Swatch" | "Text";
  values: string[];
};

export type Customer = {
  avatarClass: string;
  email: string;
  ltv: string;
  name: string;
  orders: number;
  segment: string;
  status: Extract<Status, "active" | "review">;
};

export const categories: Category[] = [
  ["Headphones", "headphones", 42, "published", "cat-bg-headphones-01.webp"],
  [
    "Charging Cable",
    "charging-cable",
    28,
    "published",
    "cat-transp-img-01.webp",
  ],
  ["Power Adapter", "power-adapter", 19, "published", "cat-transp-img-02.webp"],
  ["Power Bank", "power-bank", 31, "published", "cat-transp-img-03.webp"],
  [
    "Bluetooth Speaker",
    "bluetooth-speaker",
    24,
    "published",
    "cat-bg-headphones-02.webp",
  ],
  ["Mini Speaker", "mini-speaker", 12, "draft", "cat-bg-headphones-03.webp"],
  ["Smart Watch", "smart-watch", 37, "published", "cat-transp-img-08.webp"],
  ["Smart TV", "smart-tv", 9, "draft", "cat-transp-img-09.webp"],
  [
    "Wireless Headphones",
    "wireless-headphones",
    44,
    "published",
    "cat-transp-img-10.webp",
  ],
  [
    "Portable Speaker",
    "portable-speaker",
    18,
    "published",
    "cat-bg-headphones-04.webp",
  ],
  ["Microphone", "microphone", 15, "draft", "cat-bg-headphones-05.webp"],
  [
    "Over-Ear Headphones",
    "over-ear-headphones",
    26,
    "published",
    "cat-transp-img-06.webp",
  ],
  ["Camera", "camera", 33, "published", "cat-transp-img-07.webp"],
  ["Tablet", "tablet", 21, "published", "cat-transp-img-11.webp"],
  ["Gaming Mouse", "gaming-mouse", 17, "draft", "cat-transp-img-12.webp"],
].map(([name, slug, count, status, file]) => ({
  count: Number(count),
  image: `${baseURL}assets/images/catagory-img/${file}`,
  name: String(name),
  slug: String(slug),
  status: status as Category["status"],
}));

const demoBrandImage = `${baseURL}/assets/products/oat-biscuit.svg`;

export const brands: Brand[] = [
  {
    count: 42,
    image: demoBrandImage,
    name: "Acme Audio",
    slug: "acme-audio",
    status: "published",
    visibility: "Featured",
    website: "acmeaudio.com",
  },
  {
    count: 28,
    image: demoBrandImage,
    name: "FreshFarm",
    slug: "freshfarm",
    status: "published",
    visibility: "Featured",
    website: "freshfarm.co",
  },
  {
    count: 35,
    image: demoBrandImage,
    name: "UrbanWear",
    slug: "urbanwear",
    status: "published",
    visibility: "Standard",
    website: "urbanwear.shop",
  },
  {
    count: 21,
    image: demoBrandImage,
    name: "HomeHaven",
    slug: "homehaven",
    status: "published",
    visibility: "Standard",
    website: "homehaven.store",
  },
  {
    count: 18,
    image: demoBrandImage,
    name: "GlowCare",
    slug: "glowcare",
    status: "draft",
    visibility: "Featured",
    website: "glowcare.com",
  },
  {
    count: 56,
    image: demoBrandImage,
    name: "TechNova",
    slug: "technova",
    status: "published",
    visibility: "Featured",
    website: "technova.dev",
  },
  {
    count: 16,
    image: demoBrandImage,
    name: "FitFuel",
    slug: "fitfuel",
    status: "draft",
    visibility: "Standard",
    website: "fitfuel.life",
  },
  {
    count: 12,
    image: demoBrandImage,
    name: "PetNest",
    slug: "petnest",
    status: "published",
    visibility: "Standard",
    website: "petnest.shop",
  },
  {
    count: 24,
    image: demoBrandImage,
    name: "PureDairy",
    slug: "puredairy",
    status: "archived",
    visibility: "Hidden",
    website: "puredairy.co",
  },
  {
    count: 31,
    image: demoBrandImage,
    name: "DailyBake",
    slug: "dailybake",
    status: "published",
    visibility: "Standard",
    website: "dailybake.store",
  },
  {
    count: 27,
    image: demoBrandImage,
    name: "GreenLeaf",
    slug: "greenleaf",
    status: "published",
    visibility: "Featured",
    website: "greenleaf.market",
  },
  {
    count: 14,
    image: demoBrandImage,
    name: "NovaKids",
    slug: "novakids",
    status: "draft",
    visibility: "Standard",
    website: "novakids.shop",
  },
];

export const attributes: Attribute[] = [
  {
    name: "Color",
    products: 128,
    status: "published",
    type: "Swatch",
    values: ["Red", "Blue", "Green", "Black"],
  },
  {
    name: "Size",
    products: 96,
    status: "published",
    type: "Dropdown",
    values: ["XS", "S", "M", "L", "XL"],
  },
  {
    name: "Material",
    products: 44,
    status: "draft",
    type: "Text",
    values: ["Cotton", "Steel", "Wood"],
  },
];

export const customers: Customer[] = [
  {
    avatarClass: "bg-brand-50 text-brand-600",
    email: "mila@example.com",
    ltv: "$4,812",
    name: "Mila Horton",
    orders: 28,
    segment: "VIP",
    status: "active",
  },
  {
    avatarClass: "bg-warning-50 text-warning-600",
    email: "rafi@example.com",
    ltv: "$2,108",
    name: "Rafi Ahmed",
    orders: 12,
    segment: "Wholesale",
    status: "review",
  },
  {
    avatarClass: "bg-success-50 text-success-600",
    email: "neha@example.com",
    ltv: "$946",
    name: "Neha Carter",
    orders: 7,
    segment: "Retail",
    status: "active",
  },
];

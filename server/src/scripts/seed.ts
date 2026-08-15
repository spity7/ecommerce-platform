import "dotenv/config";
import { connectDatabase, disconnectDatabase } from "../config/database.js";
import { Attribute } from "../models/Attribute.js";
import { Brand } from "../models/Brand.js";
import { Category } from "../models/Category.js";
import { Product } from "../models/Product.js";

const beautyCategories = [
  {
    name: "Skincare",
    slug: "skincare",
    image: "/assets/images/catagory-img/cat-transp-img-01.webp",
    status: "published" as const,
  },
  {
    name: "Makeup",
    slug: "makeup",
    image: "/assets/images/catagory-img/cat-transp-img-02.webp",
    status: "published" as const,
  },
  {
    name: "Fragrance",
    slug: "fragrance",
    image: "/assets/images/catagory-img/cat-transp-img-03.webp",
    status: "published" as const,
  },
  {
    name: "Hair Care",
    slug: "hair-care",
    image: "/assets/images/catagory-img/cat-bg-headphones-01.webp",
    status: "published" as const,
  },
];

const beautyBrands = [
  {
    name: "Glow Lab",
    slug: "glow-lab",
    website: "glowlab.com",
    initials: "GL",
    tileClass: "bg-brand-50 text-brand-600",
    visibility: "Featured" as const,
    status: "published" as const,
  },
  {
    name: "Pure Skin",
    slug: "pure-skin",
    website: "pureskin.com",
    initials: "PS",
    tileClass: "bg-success-50 text-success-600",
    visibility: "Standard" as const,
    status: "published" as const,
  },
];

const beautyAttributes = [
  {
    name: "Skin Type",
    slug: "skin-type",
    displayType: "Dropdown" as const,
    description: "Recommended skin type for the product.",
    status: "active" as const,
    values: ["Oily", "Dry", "Combination", "Sensitive"],
  },
  {
    name: "SPF Level",
    slug: "spf-level",
    displayType: "Dropdown" as const,
    description: "Sun protection factor.",
    status: "active" as const,
    values: ["15", "30", "50"],
  },
];

const beautyProducts = [
  {
    name: "Hydrating Vitamin C Serum",
    slug: "hydrating-vitamin-c-serum",
    sku: "BS-SK-001",
    description: "Brightening daily serum with stable vitamin C.",
    price: 42,
    compareAtPrice: 52,
    stock: 120,
    status: "published" as const,
    images: [
      "/assets/images/product-img/beauty-product/beauty-product-st-05.webp",
    ],
    attributes: {
      "skin-type": "Combination",
    },
  },
  {
    name: "SPF 50 Daily Moisturizer",
    slug: "spf-50-daily-moisturizer",
    sku: "BS-SK-002",
    description: "Lightweight moisturizer with broad-spectrum SPF 50.",
    price: 36,
    stock: 8,
    status: "published" as const,
    images: [
      "/assets/images/product-img/beauty-product/beauty-product-st-06.webp",
    ],
    attributes: {
      "skin-type": "Sensitive",
      "spf-level": "50",
    },
  },
  {
    name: "Rosewater Balancing Toner",
    slug: "rosewater-balancing-toner",
    sku: "BS-SK-003",
    description: "Alcohol-free toner to refresh and balance skin.",
    price: 24,
    stock: 64,
    status: "published" as const,
    images: [
      "/assets/images/product-img/beauty-product/beauty-product-st-07.webp",
    ],
    attributes: {
      "skin-type": "Dry",
    },
  },
  {
    name: "Overnight Repair Cream",
    slug: "overnight-repair-cream",
    sku: "BS-SK-004",
    description: "Rich night cream for deep hydration.",
    price: 58,
    stock: 45,
    status: "draft" as const,
    images: [
      "/assets/images/product-img/beauty-product/beauty-product-st-08.webp",
    ],
    attributes: {
      "skin-type": "Dry",
    },
  },
];

async function seed() {
  await connectDatabase();

  await Promise.all([
    Product.deleteMany({}),
    Category.deleteMany({}),
    Brand.deleteMany({}),
    Attribute.deleteMany({}),
  ]);

  const categories = await Category.insertMany(beautyCategories);
  const brands = await Brand.insertMany(beautyBrands);
  await Attribute.insertMany(beautyAttributes);

  const skincare = categories.find((item) => item.slug === "skincare");
  const glowLab = brands.find((item) => item.slug === "glow-lab");

  const products = beautyProducts.map((product, index) => ({
    ...product,
    categoryId: skincare?._id,
    categoryName: skincare?.name ?? "Skincare",
    brandId: index % 2 === 0 ? glowLab?._id : undefined,
    brandName: index % 2 === 0 ? (glowLab?.name ?? "") : "",
  }));

  await Product.insertMany(products);

  if (skincare) {
    await Category.updateOne(
      { _id: skincare._id },
      { $set: { productCount: products.length } }
    );
  }
  if (glowLab) {
    await Brand.updateOne(
      { _id: glowLab._id },
      { $set: { productCount: Math.ceil(products.length / 2) } }
    );
  }

  console.log("Beauty Station seed completed.");
  console.log(
    `Created ${categories.length} categories, ${brands.length} brands, ${beautyAttributes.length} attributes, ${products.length} products.`
  );

  await disconnectDatabase();
}

seed().catch(async (error) => {
  console.error("Seed failed:", error);
  await disconnectDatabase();
  process.exit(1);
});

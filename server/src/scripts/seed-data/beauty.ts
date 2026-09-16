import type { SiteSeedData } from "./types.js";

const productImage = (file: string) =>
  `/assets/images/product-img/beauty-product/${file}`;

const categoryImage = (file: string) => `/assets/images/catagory-img/${file}`;

export const beautySeedData: SiteSeedData = {
  label: "beauty",
  primaryCategorySlug: "skincare",
  primaryBrandSlug: "glow-lab",
  categories: [
    {
      name: "Skincare",
      slug: "skincare",
      image: categoryImage("cat-transp-img-01.webp"),
      status: "published",
    },
    {
      name: "Makeup",
      slug: "makeup",
      image: categoryImage("cat-transp-img-02.webp"),
      status: "published",
    },
    {
      name: "Fragrance",
      slug: "fragrance",
      image: categoryImage("cat-transp-img-03.webp"),
      status: "published",
    },
    {
      name: "Hair Care",
      slug: "hair-care",
      image: categoryImage("cat-transp-img-04.webp"),
      status: "published",
    },
  ],
  brands: [
    {
      name: "Glow Lab",
      slug: "glow-lab",
      website: "glowlab.com",
      initials: "GL",
      tileClass: "bg-brand-50 text-brand-600",
      visibility: "Featured",
      status: "published",
    },
    {
      name: "Pure Skin",
      slug: "pure-skin",
      website: "pureskin.com",
      initials: "PS",
      tileClass: "bg-success-50 text-success-600",
      visibility: "Standard",
      status: "published",
    },
  ],
  attributes: [
    {
      name: "Skin Type",
      slug: "skin-type",
      displayType: "Dropdown",
      description: "Recommended skin type for the product.",
      status: "published",
      values: ["Oily", "Dry", "Combination", "Sensitive"],
    },
    {
      name: "SPF Level",
      slug: "spf-level",
      displayType: "Dropdown",
      description: "Sun protection factor.",
      status: "published",
      values: ["15", "30", "50"],
    },
  ],
  products: [
    {
      name: "Hydrating Vitamin C Serum",
      slug: "hydrating-vitamin-c-serum",
      sku: "BS-SK-001",
      description:
        "Brightening daily serum with stable vitamin C for an even, radiant complexion.",
      price: 42,
      compareAtPrice: 52,
      stock: 120,
      status: "published",
      categorySlug: "skincare",
      brandSlug: "glow-lab",
      images: [productImage("beauty-product-st-01.webp")],
      attributes: { "skin-type": "Combination" },
      unitsSold: 24,
      metadata: {
        merchandising: {
          manualBadges: [{ kind: "staff_pick" }, { kind: "best_seller" }],
        },
      },
    },
    {
      name: "SPF 50 Daily Moisturizer",
      slug: "spf-50-daily-moisturizer",
      sku: "BS-SK-002",
      description:
        "Lightweight moisturizer with broad-spectrum SPF 50 for everyday protection.",
      price: 36,
      stock: 3,
      status: "published",
      metadata: {
        merchandising: {
          manualBadges: [{ kind: "trending" }],
        },
      },
      categorySlug: "skincare",
      brandSlug: "glow-lab",
      images: [productImage("beauty-product-st-02.webp")],
      attributes: { "skin-type": "Sensitive", "spf-level": "50" },
    },
    {
      name: "Rosewater Balancing Toner",
      slug: "rosewater-balancing-toner",
      sku: "BS-SK-003",
      description:
        "Alcohol-free toner that refreshes skin and restores natural balance.",
      price: 24,
      stock: 64,
      status: "published",
      categorySlug: "skincare",
      brandSlug: "pure-skin",
      images: [productImage("beauty-product-st-03.webp")],
      attributes: { "skin-type": "Dry" },
      compareAtPrice: 30,
      metadata: {
        merchandising: {
          suppressAutoBadges: ["new"],
        },
      },
    },
    {
      name: "Overnight Repair Cream",
      slug: "overnight-repair-cream",
      sku: "BS-SK-004",
      description:
        "Rich night cream for deep hydration and barrier repair while you sleep.",
      price: 58,
      stock: 45,
      status: "draft",
      categorySlug: "skincare",
      brandSlug: "pure-skin",
      images: [productImage("beauty-product-st-04.webp")],
      attributes: { "skin-type": "Dry" },
    },
    {
      name: "Matte Lip Color",
      slug: "matte-lip-color",
      sku: "BS-MK-001",
      description:
        "Long-wear matte lipstick with a comfortable, non-drying finish.",
      price: 22,
      compareAtPrice: 28,
      stock: 90,
      status: "published",
      categorySlug: "makeup",
      brandSlug: "glow-lab",
      images: [productImage("beauty-product-st-05.webp")],
    },
    {
      name: "Luminous Foundation",
      slug: "luminous-foundation",
      sku: "BS-MK-002",
      description:
        "Buildable medium coverage foundation with a natural luminous finish.",
      price: 34,
      compareAtPrice: 44,
      stock: 55,
      status: "published",
      categorySlug: "makeup",
      brandSlug: "pure-skin",
      images: [productImage("beauty-product-st-06.webp")],
      attributes: { "skin-type": "Combination" },
    },
    {
      name: "Nude Eyeshadow Palette",
      slug: "nude-eyeshadow-palette",
      sku: "BS-MK-003",
      description:
        "Twelve versatile nude shades for everyday looks and soft evening glam.",
      price: 48,
      stock: 32,
      status: "published",
      categorySlug: "makeup",
      brandSlug: "glow-lab",
      images: [productImage("beauty-product-st-07.webp")],
      metadata: {
        merchandising: {
          manualBadges: [{ kind: "hot" }],
        },
      },
    },
    {
      name: "Rose Eau de Parfum",
      slug: "rose-eau-de-parfum",
      sku: "BS-FR-001",
      description: "Floral fragrance with notes of rose, peony, and warm musk.",
      price: 72,
      compareAtPrice: 89,
      stock: 40,
      status: "published",
      categorySlug: "fragrance",
      brandSlug: "pure-skin",
      images: [productImage("beauty-product-st-08.webp")],
    },
    {
      name: "Citrus Body Mist",
      slug: "citrus-body-mist",
      sku: "BS-FR-002",
      description:
        "Light, refreshing body mist with bergamot and neroli for daily wear.",
      price: 28,
      stock: 75,
      status: "published",
      categorySlug: "fragrance",
      brandSlug: "glow-lab",
      images: [productImage("beauty-product-st-09.webp")],
    },
    {
      name: "Repairing Hair Mask",
      slug: "repairing-hair-mask",
      sku: "BS-HC-001",
      description:
        "Weekly treatment mask that restores shine and reduces breakage.",
      price: 32,
      compareAtPrice: 40,
      stock: 4,
      status: "published",
      categorySlug: "hair-care",
      brandSlug: "pure-skin",
      images: [productImage("beauty-product-st-10.webp")],
    },
    {
      name: "Volumizing Shampoo",
      slug: "volumizing-shampoo",
      sku: "BS-HC-002",
      description:
        "Gentle sulfate-free shampoo that adds body without weighing hair down.",
      price: 18,
      stock: 110,
      status: "published",
      categorySlug: "hair-care",
      brandSlug: "glow-lab",
      images: [productImage("beauty-product-st-11.webp")],
    },
    {
      name: "Peptide Firming Eye Cream",
      slug: "peptide-firming-eye-cream",
      sku: "BS-SK-005",
      description:
        "Targeted eye cream with peptides to smooth fine lines and brighten dark circles.",
      price: 38,
      stock: 85,
      status: "published",
      categorySlug: "skincare",
      brandSlug: "pure-skin",
      images: [productImage("beauty-product-st-12.webp")],
      attributes: { "skin-type": "Combination" },
      unitsSold: 52,
    },
    {
      name: "Retinol Renewal Capsules",
      slug: "retinol-renewal-capsules",
      sku: "BS-SK-006",
      description:
        "Single-dose retinol capsules for gradual resurfacing with minimal irritation.",
      price: 65,
      compareAtPrice: 78,
      stock: 0,
      status: "published",
      categorySlug: "skincare",
      brandSlug: "glow-lab",
      images: [productImage("beauty-product-st-13.webp")],
      attributes: { "skin-type": "Dry" },
    },
    {
      name: "Strobe Glow Highlighter",
      slug: "strobe-glow-highlighter",
      sku: "BS-MK-004",
      description:
        "Silky powder highlighter for a candlelit glow on cheekbones and brow bone.",
      price: 26,
      stock: 60,
      status: "published",
      categorySlug: "makeup",
      brandSlug: "glow-lab",
      images: [productImage("beauty-product-st-14.webp")],
      metadata: {
        merchandising: {
          manualBadges: [{ kind: "best_seller" }, { kind: "hot" }],
        },
      },
    },
    {
      name: "Last Chance Lip Duo",
      slug: "last-chance-lip-duo",
      sku: "BS-MK-005",
      description:
        "Two full-size lip colors in a limited kit while supplies last.",
      price: 19,
      compareAtPrice: 32,
      stock: 22,
      status: "published",
      categorySlug: "makeup",
      brandSlug: "pure-skin",
      images: [productImage("beauty-product-st-15.webp")],
      metadata: {
        merchandising: {
          manualBadges: [{ kind: "clearance" }],
        },
      },
    },
    {
      name: "Exclusive Rose Discovery Set",
      slug: "exclusive-rose-discovery-set",
      sku: "BS-FR-003",
      description:
        "Curated mini fragrance set with rollerball and body cream — online exclusive.",
      price: 45,
      compareAtPrice: 58,
      stock: 35,
      status: "published",
      categorySlug: "fragrance",
      brandSlug: "glow-lab",
      images: [productImage("beauty-product-st-09.webp")],
      metadata: {
        merchandising: {
          manualBadges: [{ kind: "exclusive" }, { kind: "limited_offer" }],
        },
      },
    },
    {
      name: "Organic Cold-Pressed Face Oil",
      slug: "organic-cold-pressed-face-oil",
      sku: "BS-SK-007",
      description:
        "Plant-based facial oil with squalane and rosehip for dewy, balanced skin.",
      price: 44,
      stock: 28,
      status: "published",
      categorySlug: "skincare",
      brandSlug: "pure-skin",
      images: [productImage("beauty-product-st-04.webp")],
      metadata: {
        merchandising: {
          manualBadges: [{ kind: "organic" }, { kind: "vegan" }],
        },
      },
    },
    {
      name: "Flash Deal Micellar Water",
      slug: "flash-deal-micellar-water",
      sku: "BS-SK-008",
      description:
        "Gentle micellar cleanser that removes makeup without rinsing.",
      price: 14,
      compareAtPrice: 22,
      stock: 95,
      status: "published",
      categorySlug: "skincare",
      brandSlug: "glow-lab",
      images: [productImage("beauty-product-st-03.webp")],
      metadata: {
        merchandising: {
          manualBadges: [
            {
              kind: "limited_offer",
              label: "Flash deal",
            },
          ],
        },
      },
    },
    {
      name: "Cruelty-Free Lash Serum",
      slug: "cruelty-free-lash-serum",
      sku: "BS-MK-006",
      description:
        "Conditioning lash serum for fuller-looking lashes in 8 weeks.",
      price: 39,
      stock: 18,
      status: "published",
      categorySlug: "makeup",
      brandSlug: "glow-lab",
      images: [productImage("beauty-product-st-05.webp")],
      metadata: {
        merchandising: {
          manualBadges: [{ kind: "cruelty_free" }],
        },
      },
    },
    {
      name: "Back in Stock Hydrating Mist",
      slug: "back-in-stock-hydrating-mist",
      sku: "BS-SK-009",
      description:
        "Fine mist with hyaluronic acid for instant hydration over makeup.",
      price: 20,
      stock: 42,
      status: "published",
      categorySlug: "skincare",
      brandSlug: "glow-lab",
      images: [productImage("beauty-product-st-02.webp")],
      metadata: {
        merchandising: {
          manualBadges: [{ kind: "back_in_stock" }],
        },
      },
    },
    {
      name: "Bundle & Save Skincare Trio",
      slug: "bundle-save-skincare-trio",
      sku: "BS-SK-010",
      description:
        "Three-step mini routine: cleanse, treat, and moisturize in one kit.",
      price: 49,
      compareAtPrice: 68,
      stock: 12,
      status: "published",
      categorySlug: "skincare",
      brandSlug: "glow-lab",
      images: [productImage("beauty-product-st-01.webp")],
      metadata: {
        merchandising: {
          manualBadges: [{ kind: "bundle" }, { kind: "free_gift" }],
        },
      },
    },
  ],
};

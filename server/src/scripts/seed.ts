import "dotenv/config";
import { connectDatabase, disconnectDatabase } from "../config/database.js";
import { env } from "../config/env.js";
import { Attribute } from "../models/Attribute.js";
import { Brand } from "../models/Brand.js";
import { Category } from "../models/Category.js";
import { Product } from "../models/Product.js";
import { getSeedDataForSite } from "./seed-data/index.js";
import { extractAttributeSlugs } from "../utils/catalog-relations.js";

async function seed() {
  const seedData = getSeedDataForSite(env.SITE_ID, env.site.homeLayout);

  await connectDatabase();

  await Promise.all([
    Product.deleteMany({}),
    Category.deleteMany({}),
    Brand.deleteMany({}),
    Attribute.deleteMany({}),
  ]);

  const categories = await Category.insertMany(seedData.categories);
  const brands = await Brand.insertMany(seedData.brands);
  await Attribute.insertMany(seedData.attributes);

  const primaryCategory = categories.find(
    (item) => item.slug === seedData.primaryCategorySlug
  );
  const primaryBrand = brands.find(
    (item) => item.slug === seedData.primaryBrandSlug
  );

  const products = seedData.products.map((product, index) => ({
    ...product,
    categoryId: primaryCategory?._id,
    categoryName: primaryCategory?.name ?? seedData.categories[0]?.name ?? "",
    brandId: index % 2 === 0 ? primaryBrand?._id : undefined,
    brandName: index % 2 === 0 ? (primaryBrand?.name ?? "") : "",
  }));

  await Product.insertMany(products);

  if (primaryCategory) {
    await Category.updateOne(
      { _id: primaryCategory._id },
      { $set: { productCount: products.length } }
    );
  }
  if (primaryBrand) {
    await Brand.updateOne(
      { _id: primaryBrand._id },
      { $set: { productCount: Math.ceil(products.length / 2) } }
    );
  }

  const attributeUsage = new Map<string, number>();
  for (const product of products) {
    for (const slug of extractAttributeSlugs(product.attributes ?? {})) {
      attributeUsage.set(slug, (attributeUsage.get(slug) ?? 0) + 1);
    }
  }

  await Promise.all(
    [...attributeUsage.entries()].map(([slug, productCount]) =>
      Attribute.updateOne({ slug }, { $set: { productCount } })
    )
  );

  console.log(
    `${env.site.name} seed completed (${seedData.label} dataset for ${env.SITE_ID}).`
  );
  console.log(
    `Created ${categories.length} categories, ${brands.length} brands, ${seedData.attributes.length} attributes, ${products.length} products.`
  );

  await disconnectDatabase();
}

seed().catch(async (error) => {
  console.error("Seed failed:", error);
  await disconnectDatabase();
  process.exit(1);
});

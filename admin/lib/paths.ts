import { pathBuilders } from "@/config/routes";

export function productEditPath(id: string) {
  return pathBuilders.editProduct(id);
}

export function categoryEditPath(id: string) {
  return pathBuilders.editCategory(id);
}

export function brandEditPath(id: string) {
  return pathBuilders.editBrand(id);
}

export function attributeEditPath(id: string) {
  return pathBuilders.editAttribute(id);
}

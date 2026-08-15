import type { ComponentType } from "react";
import type { HomeLayoutId } from "@platform/shared";
import CosmeticBeautyTwoHome from "./home-layouts/cosmetic-beauty-two";

const homeLayouts: Record<HomeLayoutId, ComponentType> = {
  "cosmetic-beauty-two": CosmeticBeautyTwoHome,
  "cosmetic-beauty-three": CosmeticBeautyTwoHome,
  "cosmetic-beauty-four": CosmeticBeautyTwoHome,
  sport: CosmeticBeautyTwoHome,
  general: CosmeticBeautyTwoHome,
};

type HomeLayoutRendererProps = {
  layout: HomeLayoutId;
};

export function HomeLayoutRenderer({ layout }: HomeLayoutRendererProps) {
  const Layout = homeLayouts[layout] ?? CosmeticBeautyTwoHome;
  return <Layout />;
}

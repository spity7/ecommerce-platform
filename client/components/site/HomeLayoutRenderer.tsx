import type { ComponentType } from "react";
import type { HomeLayoutId } from "@platform/shared";
import CosmeticBeautyFourHome from "./home-layouts/cosmetic-beauty-four";
import CosmeticBeautyThreeHome from "./home-layouts/cosmetic-beauty-three";
import CosmeticBeautyTwoHome from "./home-layouts/cosmetic-beauty-two";
import GeneralHome from "./home-layouts/general";
import SportHome from "./home-layouts/sport";

const homeLayouts: Record<HomeLayoutId, ComponentType> = {
  "cosmetic-beauty-two": CosmeticBeautyTwoHome,
  "cosmetic-beauty-three": CosmeticBeautyThreeHome,
  "cosmetic-beauty-four": CosmeticBeautyFourHome,
  sport: SportHome,
  general: GeneralHome,
};

type HomeLayoutRendererProps = {
  layout: HomeLayoutId;
};

export function HomeLayoutRenderer({ layout }: HomeLayoutRendererProps) {
  const Layout = homeLayouts[layout] ?? CosmeticBeautyTwoHome;
  return <Layout />;
}

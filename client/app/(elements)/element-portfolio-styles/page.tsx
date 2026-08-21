import { Metadata } from "next";
import PortfolioGridIsotop from "@/components/elements/element-portfolio-styles/PortfolioGridIsotop";
import PortfolioGridThreeColoumn from "@/components/elements/element-portfolio-styles/PortfolioGridThreeColoumn";
import PortfolioGridFourColoumn from "@/components/elements/element-portfolio-styles/PortfolioGridFourColoumn";
import PortfolioGridThreeWider from "@/components/elements/element-portfolio-styles/PortfolioGridThreeWider";
import PortfolioGridIsotopWiderOne from "@/components/elements/element-portfolio-styles/PortfolioGridIsotopWiderOne";
import PortfolioGridIsotopWiderTwo from "@/components/elements/element-portfolio-styles/PortfolioGridIsotopWiderTwo";
import ElementsHero from "@/components/elements/ElementsHero";
export const metadata: Metadata = {
  title:
    "Element Portfolio Styles | Discover premium cosmetics and skincare products at Beauty Station.",
  description:
    "Discover premium cosmetics and skincare products at Beauty Station.",
};
export default function ElementPortfolioStylesPage() {
  return (
    <>
      <>
        <ElementsHero
          title={
            <>
              Exclusive <span>Portfolio Styles</span>
            </>
          }
        />
        <PortfolioGridIsotop />
        <PortfolioGridThreeColoumn />
        <PortfolioGridFourColoumn />
        <PortfolioGridThreeWider />
        <PortfolioGridIsotopWiderOne />
        <PortfolioGridIsotopWiderTwo />
      </>
    </>
  );
}

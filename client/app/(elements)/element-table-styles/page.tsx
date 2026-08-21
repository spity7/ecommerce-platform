import { Metadata } from "next";
import CompareTableOne from "@/components/elements/element-table-styles/CompareTableOne";
import ElementsHero from "@/components/elements/ElementsHero";
export const metadata: Metadata = {
  title:
    "Element Table Styles | Discover premium cosmetics and skincare products at Beauty Station.",
  description:
    "Discover premium cosmetics and skincare products at Beauty Station.",
};
export default function ElementTableStylesPage() {
  return (
    <>
      <>
        <ElementsHero
          title={
            <>
              Exclusive <span>Table Styles</span>
            </>
          }
        />
        <CompareTableOne />
      </>
    </>
  );
}

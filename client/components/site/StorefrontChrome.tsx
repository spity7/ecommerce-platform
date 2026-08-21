import Footer7 from "@/components/footers/Footer7";
import Header13 from "@/components/headers/Header13";

type StorefrontChromeProps = {
  children: React.ReactNode;
};

export function StorefrontChrome({ children }: StorefrontChromeProps) {
  return (
    <>
      <Header13 sticky={true} />
      {children}
      <Footer7 />
    </>
  );
}

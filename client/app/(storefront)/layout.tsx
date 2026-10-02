import { StorefrontChrome } from "@/components/site/StorefrontChrome";

export default function StorefrontProductionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StorefrontChrome headerTransparent={false}>{children}</StorefrontChrome>
  );
}

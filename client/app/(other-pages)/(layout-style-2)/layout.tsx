import { StorefrontChrome } from "@/components/site/StorefrontChrome";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <StorefrontChrome headerTransparent={false}>{children}</StorefrontChrome>
  );
}

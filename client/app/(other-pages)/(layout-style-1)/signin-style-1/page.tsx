import Signin from "@/components/other-pages/Signin";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In (Style 1) | Theme Demo",
  description: "Demo sign-in layout with Header2 chrome.",
};

export default function SignInStyleOneDemoPage() {
  return <Signin />;
}

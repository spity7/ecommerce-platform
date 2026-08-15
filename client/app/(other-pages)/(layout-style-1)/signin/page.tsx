import Signin from "@/components/other-pages/Signin";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Beauty Station | Cosmetics & Skincare",
  description: "Sign in to your Beauty Station account.",
};

export default function page() {
  return (
    <>
      <Signin />
    </>
  );
}

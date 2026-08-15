import Signup from "@/components/other-pages/Signup";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | Beauty Station | Cosmetics & Skincare",
  description: "Create your Beauty Station customer account.",
};

export default function page() {
  return (
    <>
      <Signup />
    </>
  );
}

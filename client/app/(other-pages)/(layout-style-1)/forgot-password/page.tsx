import ForgotPassword from "@/components/other-pages/ForgotPassword";

import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Forgot Password | Beauty Station | Cosmetics & Skincare",
  description: "Recover access to your Beauty Station account.",
};

export default function page() {
  return (
    <>
      <ForgotPassword />
    </>
  );
}

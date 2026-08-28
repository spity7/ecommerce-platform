import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { createAdminMetadata } from "@/lib/brand";

export const metadata: Metadata = createAdminMetadata("Forgot Password");

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
